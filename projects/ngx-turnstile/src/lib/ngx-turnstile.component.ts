import {
  Component,
  ElementRef,
  Input,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy,
  Inject,
  afterNextRender,
  signal,
  computed,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
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

@Component({
  selector: 'ngx-turnstile',
  template: ``,
  exportAs: 'ngx-turnstile',
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
  @Input() retry?: 'never' | 'auto' = 'auto';
  @Input() size?: 'normal' | 'flexible' | 'compact' = 'normal';

  @Output() resolved = new EventEmitter<string | null>();
  @Output() errored = new EventEmitter<string | null>();

  private widgetId = signal<string | null | undefined>(undefined);

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.loadScript();

    // Create the widget after the element is rendered (assuming the script is loaded)
    afterNextRender(() => {
      if (this.scriptLoaded() && !this.widgetLoaded()) {
        this.createWidget();
      }
    });

    // Create the widget after the script is loaded (assuming it has not been created already)
    toObservable(this.scriptLoaded).subscribe((scriptLoaded) => {
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
    window[CALLBACK_NAME] = () =>
      this.zone.run(() => this.scriptLoaded.set(true));

    this.scriptLoaded.set(!!window.turnstile);
    const scriptPending = !!this.document.getElementById(SCRIPT_ID);
    if (!this.scriptLoaded() && !scriptPending) {
      const script = this.document.createElement('script');
      script.src = `${this._getCloudflareTurnstileUrl()}?render=explicit&onload=${CALLBACK_NAME}`;
      script.id = SCRIPT_ID;
      script.async = true;
      script.defer = true;
      this.document.head.appendChild(script);
    }
  }

  public createWidget(): void {
    let turnstileOptions: TurnstileOptions = {
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
    };

    const render = () => {
      // Stop if the element does not exist yet
      if (!this.elementRef?.nativeElement) {
        return;
      }

      // Remove any active widget so we can create a new one
      this.remove();

      // Render the Turnstile widget
      const widgetId = window.turnstile.render(
        this.elementRef.nativeElement,
        turnstileOptions,
      );
      this.widgetId.set(widgetId);
    };

    if (this.scriptLoaded()) {
      render();
    }
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
    this.remove();
  }

  public scriptLoaded = signal(false);

  public widgetLoaded = computed(() => !!this.widgetId());
}
