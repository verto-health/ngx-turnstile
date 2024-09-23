import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy,
  Inject,
  afterNextRender,
} from '@angular/core';
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

  @Output() resolved = new EventEmitter<string | null>();
  @Output() errored = new EventEmitter<string | null>();

  private widgetId!: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
  ) {
    afterNextRender(this.createWidget.bind(this));
  }

  private _getCloudflareTurnstileUrl(): string {
    if (this.version === '0') {
      return 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    }

    throw 'Version not defined in ngx-turnstile component.';
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

  public reset(): void {
    if (this.widgetId) {
      this.resolved.emit(null);
      window.turnstile.reset(this.widgetId);
    }
  }

  public ngOnDestroy(): void {
    if (this.widgetId) {
      window.turnstile.remove(this.widgetId);
    }
  }

  public scriptLoaded(): boolean {
    return !!this.document.getElementById(SCRIPT_ID);
  }
}
