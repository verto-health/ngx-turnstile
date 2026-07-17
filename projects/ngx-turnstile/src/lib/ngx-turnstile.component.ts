import {
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  signal,
  computed,
  DOCUMENT,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { TurnstileOptions } from './interfaces/turnstile-options';

declare global {
  interface Window {
    onloadTurnstileCallback: () => void;
    turnstile: {
      render: (
        idOrContainer: string | HTMLElement,
        options: TurnstileOptions,
      ) => string;
      reset: (widgetIdOrContainer: string | HTMLElement) => void;
      getResponse: (
        widgetIdOrContainer: string | HTMLElement,
      ) => string | undefined;
      remove: (widgetIdOrContainer: string | HTMLElement) => void;
    };
  }
}

const SCRIPT_ID = 'ngx-turnstile';
const CALLBACK_NAME = 'onloadTurnstileCallback';
type SupportedVersion = '0';

// Every mounted component waiting for the Turnstile script to finish loading.
// A single global onload callback notifies all of them, so multiple widgets on
// the same page each get rendered (not just the last one that was created).
const scriptLoadListeners = new Set<() => void>();

@Component({
  selector: 'ngx-turnstile',
  template: ``,
  exportAs: 'ngx-turnstile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NgxTurnstileComponent implements OnDestroy {
  @Input() siteKey!: string;
  @Input() action?: string;
  @Input() cData?: string;
  @Input() theme?: 'light' | 'dark' | 'auto' = 'auto';
  @Input() language?: string = 'auto';
  @Input() version: SupportedVersion = '0';
  @Input() tabIndex?: number;
  @Input() appearance?: 'always' | 'execute' | 'interaction-only' = 'always';
  @Input() execution?: 'render' | 'execute';
  @Input() retry?: 'never' | 'auto' = 'auto';
  @Input() retryInterval?: number;
  @Input() refreshExpired?: 'auto' | 'manual' | 'never';
  @Input() refreshTimeout?: 'auto' | 'manual' | 'never';
  @Input() size?: 'normal' | 'flexible' | 'compact' = 'normal';
  @Input() responseField?: boolean;
  @Input() responseFieldName?: string;
  @Input() feedbackEnabled?: boolean;
  @Input() offlabelShowPrivacy?: boolean;
  @Input() offlabelShowHelp?: boolean;

  @Output() resolved = new EventEmitter<string | null>();
  @Output() errored = new EventEmitter<string | null>();
  @Output() beforeInteractive = new EventEmitter<void>();
  @Output() afterInteractive = new EventEmitter<void>();
  @Output() unsupported = new EventEmitter<void>();
  @Output() timeout = new EventEmitter<void>();

  private widgetId = signal<string | null | undefined>(undefined);

  /** Whether the Cloudflare Turnstile script has finished loading. */
  public scriptLoaded = signal(false);

  /** Whether a widget is currently rendered. Clients can watch this signal. */
  public widgetLoaded = computed(() => !!this.widgetId());

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  // Notifies this instance when the shared script finishes loading. Kept as a
  // stable reference so it can be removed from the listener set on destroy.
  private onScriptLoad = (): void =>
    this.zone.run(() => this.scriptLoaded.set(true));

  constructor() {
    // Touching `window` is only safe in the browser (skip during SSR).
    if (isPlatformBrowser(this.platformId)) {
      this.loadScript();
    }

    // Render once the host element exists (if the script is already loaded).
    afterNextRender(() => {
      if (this.scriptLoaded() && !this.widgetLoaded()) {
        this.createWidget();
      }
    });

    // Render once the script finishes loading (if not already rendered).
    toObservable(this.scriptLoaded)
      .pipe(takeUntilDestroyed())
      .subscribe((scriptLoaded) => {
        if (scriptLoaded && !this.widgetLoaded()) {
          this.createWidget();
        }
      });
  }

  private _getCloudflareTurnstileUrl(): string {
    if (this.version === '0') {
      return 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    }

    throw 'Version not defined in ngx-turnstile component.';
  }

  private loadScript(): void {
    // Script already present (e.g. loaded by another widget or a prior route).
    if (window.turnstile) {
      this.scriptLoaded.set(true);
      return;
    }

    // Register to be notified when the shared script finishes loading.
    scriptLoadListeners.add(this.onScriptLoad);

    // A single global callback fans out to every waiting instance.
    window[CALLBACK_NAME] = () => {
      // Copy then clear so a listener re-registering mid-notification is safe.
      const listeners = Array.from(scriptLoadListeners);
      scriptLoadListeners.clear();
      listeners.forEach((listener) => listener());
    };

    // Only inject the script once, even with several widgets on the page.
    const scriptPending = !!this.document.getElementById(SCRIPT_ID);
    if (!scriptPending) {
      const script = this.document.createElement('script');
      script.src = `${this._getCloudflareTurnstileUrl()}?render=explicit&onload=${CALLBACK_NAME}`;
      script.id = SCRIPT_ID;
      script.async = true;
      script.defer = true;
      this.document.head.appendChild(script);
    }
  }

  public createWidget(): void {
    // Only render once the script is loaded and the host element exists.
    if (!this.scriptLoaded() || !this.elementRef?.nativeElement) {
      return;
    }

    const turnstileOptions: TurnstileOptions = {
      sitekey: this.siteKey,
      theme: this.theme,
      language: this.language,
      tabindex: this.tabIndex,
      action: this.action,
      cData: this.cData,
      appearance: this.appearance,
      retry: this.retry,
      size: this.size,
      callback: (token: string) => {
        this.zone.run(() => this.resolved.emit(token));
      },
      'error-callback': (errorCode: string): boolean => {
        this.zone.run(() => this.errored.emit(errorCode));
        // Returning false causes Turnstile to log error code as a console warning.
        return false;
      },
      'expired-callback': () => {
        this.zone.run(() => this.reset());
      },
      'before-interactive-callback': () => {
        this.zone.run(() => this.beforeInteractive.emit());
      },
      'after-interactive-callback': () => {
        this.zone.run(() => this.afterInteractive.emit());
      },
      'unsupported-callback': () => {
        this.zone.run(() => this.unsupported.emit());
      },
      'timeout-callback': () => {
        this.zone.run(() => this.timeout.emit());
      },
    };

    // Only forward optional parameters when set, so we never override
    // Cloudflare's defaults with an explicit `undefined`.
    if (this.execution !== undefined) {
      turnstileOptions.execution = this.execution;
    }
    if (this.retryInterval !== undefined) {
      turnstileOptions['retry-interval'] = this.retryInterval;
    }
    if (this.refreshExpired !== undefined) {
      turnstileOptions['refresh-expired'] = this.refreshExpired;
    }
    if (this.refreshTimeout !== undefined) {
      turnstileOptions['refresh-timeout'] = this.refreshTimeout;
    }
    if (this.responseField !== undefined) {
      turnstileOptions['response-field'] = this.responseField;
    }
    if (this.responseFieldName !== undefined) {
      turnstileOptions['response-field-name'] = this.responseFieldName;
    }
    if (this.feedbackEnabled !== undefined) {
      turnstileOptions['feedback-enabled'] = this.feedbackEnabled;
    }
    if (this.offlabelShowPrivacy !== undefined) {
      turnstileOptions['offlabel-show-privacy'] = this.offlabelShowPrivacy;
    }
    if (this.offlabelShowHelp !== undefined) {
      turnstileOptions['offlabel-show-help'] = this.offlabelShowHelp;
    }

    // Remove any existing widget so re-rendering doesn't create duplicates.
    this.remove();

    this.widgetId.set(
      window.turnstile.render(this.elementRef.nativeElement, turnstileOptions),
    );
  }

  public reset(): void {
    if (this.widgetLoaded()) {
      this.resolved.emit(null);
      window.turnstile.reset(this.widgetId()!);
    }
  }

  public remove(): void {
    if (this.widgetLoaded()) {
      window.turnstile.remove(this.widgetId()!);
      this.widgetId.set(undefined);
    }
  }

  public ngOnDestroy(): void {
    scriptLoadListeners.delete(this.onScriptLoad);
    this.remove();
  }
}
