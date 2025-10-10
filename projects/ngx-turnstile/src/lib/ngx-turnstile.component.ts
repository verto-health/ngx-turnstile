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
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppearanceMode, ExecutionMode, FailureRetryMode, RefreshExpiredMode, RefreshTimeoutMode, Theme, TurnstileOptions, WidgetSize } from './interfaces/turnstile-options';
import { Turnstile } from './interfaces/turnstile';

declare global {
  interface Window {
    [CALLBACK_NAME]: () => void;
    turnstile: Turnstile
  }
}

const SCRIPT_ID = 'ngx-turnstile';
const CALLBACK_NAME = 'onloadTurnstileCallback';
type SupportedVersion = '0';

@Component({
  selector: 'ngx-turnstile',
  template: ``,
  exportAs: 'ngx-turnstile',
  standalone: true
})
export class NgxTurnstileComponent implements OnChanges, OnDestroy {
  /**
   * Your Cloudflare Turnstile sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation.
   */
  @Input() siteKey!: string;

  /**
   * Optional. A customer value that can be used to differentiate widgets under the same sitekey in analytics and which is returned upon validation.
   */
  @Input() action?: string;

  /**
   * Optional. A customer payload that can be used to attach customer data to the challenge throughout its issuance and which is returned upon validation.
   */
  @Input() cData?: string;

  /**
   * Optional. The widget theme.
   * Accepted values: "auto", "light", "dark"
   * @see Theme
   * @default "auto"
   */
  @Input() theme?: Theme = 'auto';

  /**
   * Optional. The language picked by the customer (may not be supported).
   * This must be a valid ISO 639-1 country code, or "auto".
   * @default "auto"
   */
  @Input() language?: string = 'auto';

  /**
   * Optional. The version of Cloudflare Turnstile to use in the widget.
   * @default 0
   */
  @Input() version: SupportedVersion = '0';

  /**
   * Optional. The tabindex of Turnstile’s iframe for accessibility purposes.
   */
  @Input() tabIndex?: number;

  /**
   * Optional. The appearance mode of the widget.
   * @see AppearanceMode
   * @default "always"
   */
  @Input() appearance?: AppearanceMode = 'always';

  /**
   * Optional. How to retry on widget failure.
   * Accepted values: "auto", "never"
   * @see FailureRetryMode
   * @default "auto"
   */
  @Input() retry?: FailureRetryMode = 'auto';

  /**
   * Optional. Duration in milliseconds before the widget automatically retries.
   * @default 2000
   */
  @Input() retryInterval?: number = 2000;

  /**
   * Optional. The size of the Turnstile widget.
   * Accepted values: "normal", "compact", "flexible", "invisible"
   * Note: "invisible" is only to be used with invisible widgets
   * @see WidgetSize
   * @default "normal"
   */
  @Input() size?: WidgetSize = 'normal';

  /**
   * Optional.
   * @see RefreshExpiredMode
   * @default "auto"
   */
  @Input() refreshExpired?: RefreshExpiredMode = 'auto';

  /**
   * Optional.
   * @see RefreshTimeoutMode
   * @default "auto"
   */
  @Input() refreshTimeout?: RefreshTimeoutMode = 'auto';

  /**
   * Optional.
   * @see ExecutionMode
   * @default "render"
   */
  @Input() execution?: ExecutionMode = 'render';

  /**
   * Optional. Allows Cloudflare to gather visitor feedback upon widget failure.
   * @default true
   */
  @Input() feedbackEnabled?: boolean = true;

  /**
   * Emits the current token upon success of the challenge.
   */
  @Output() resolved = new EventEmitter<string | null>();

  /**
   * Emits an error code when there is an error (e.g. network error or the challenge failed).
   * Refer to [Client-side errors](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/).
   */
  @Output() errored = new EventEmitter<string | null>();

  /**
   * Emits the current token when a challenge expires.
   */
  @Output() expired = new EventEmitter<string | null>();

  /**
   * Emits when the Turnstile widget times out.
   */
  @Output() timedOut = new EventEmitter<boolean | null>();

  /**
   * Emits before the user is prompted for interactivity.
   */
  @Output() beforeInteractive = new EventEmitter<boolean | null>();

  /**
   * Emits when the interactive challenge has been solved.
   */
  @Output() afterInteractive = new EventEmitter<boolean | null>();

  /**
   * Emits when the browser is not supported by Turnstile.
   */
  @Output() unsupported = new EventEmitter<boolean | null>();

  private widgetId?: string | null;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
  ) {
    afterNextRender(() => this.createWidget());
  }

  private _getCloudflareTurnstileUrl(): string {
    if (this.version === '0') {
      return 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    }

    throw 'Version not defined in ngx-turnstile component.';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Remove and re-render the widget if any input values change
    const inputFields = ['siteKey','action','cData','theme','language','version','tabIndex','appearance','retry','retryInterval','size','refreshExpired','refreshTimeout','execution','feedbackEnabled'];
    if (Object.keys(changes).find(key => inputFields.includes(key))) {
      this.remove();
      this.createWidget();
    }
  }

  /**
   * Invokes a Turnstile widget and saves the ID of the newly created widget.
   */
  public createWidget(): void {
    const turnstileOptions: TurnstileOptions = {
      sitekey: this.siteKey,
      theme: this.theme,
      language: this.language,
      tabindex: this.tabIndex,
      action: this.action,
      cData: this.cData,
      appearance: this.appearance,
      retry: this.retry,
      'retry-interval': this.retryInterval,
      size: this.size,
      'refresh-expired': this.refreshExpired,
      'refresh-timeout': this.refreshTimeout,
      execution: this.execution,
      'feedback-enabled': this.feedbackEnabled,
      callback: (token: string) => {
        this.zone.run(() => this.resolved.emit(token));
      },
      'error-callback': (errorCode: string): boolean => {
        this.zone.run(() => this.errored.emit(errorCode));
        // Returning false causes Turnstile to log error code as a console warning.
        return false;
      },
      'expired-callback': (token: string) => {
        this.zone.run(() => {
          this.expired.emit(token)
          this.reset();
        });
      },
      'timeout-callback': () => {
        this.zone.run(() => this.timedOut.emit());
      },
      'before-interactive-callback': () => {
        this.zone.run(() => this.beforeInteractive.emit());
      },
      'after-interactive-callback': () => {
        this.zone.run(() => this.afterInteractive.emit());
      },
      'unsupported-callback': () => {
        this.zone.run(() => this.unsupported.emit());
      }
    };

    window[CALLBACK_NAME] = () => {
      if (!this.elementRef?.nativeElement) {
        return;
      }

      this.widgetId = window.turnstile.render(
        this.elementRef.nativeElement,
        turnstileOptions,
      );
    };

    if (this.scriptLoaded()) {
      window[CALLBACK_NAME]();
      return;
    }

    const script = this.document.createElement('script');
    script.src = `${this._getCloudflareTurnstileUrl()}?render=explicit&onload=${CALLBACK_NAME}`;
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    this.document.head.appendChild(script);
  }

  /**
   * Render a widget when `options.execution` is set to `'execute'`.
   * If `options.execution` is set to `'render'` this method has no effect.
   */
  public execute(): void {
    if (this.widgetId) {
      window.turnstile.execute(this.widgetId);
    }
  }

  /**
   * Resets a Turnstile widget.
   */
  public reset(): void {
    if (this.widgetId) {
      this.resolved.emit(null);
      window.turnstile.reset(this.widgetId);
    }
  }

  /**
   * Removes a Turnstile widget completely from the DOM.
   */
  public remove(): void {
    if (this.widgetId) {
      window.turnstile.remove(this.widgetId);
    }
  }

  public ngOnDestroy(): void {
    this.remove();
  }

  public scriptLoaded(): boolean {
    return !!this.document.getElementById(SCRIPT_ID);
  }
}
