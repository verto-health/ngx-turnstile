import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
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

const CALLBACK_NAME = 'onloadTurnstileCallback';
type SupportedVersion = '0';

@Component({
  selector: 'ngx-turnstile',
  template: ``,
  exportAs: 'ngx-turnstile',
})
export class NgxTurnstileComponent implements AfterViewInit, OnDestroy {
  @Input() siteKey!: string;
  @Input() action?: string;
  @Input() cData?: string;
  @Input() theme?: 'light' | 'dark' | 'auto' = 'auto';
  @Input() version: SupportedVersion = '0';
  @Input() tabIndex?: number;
  @Input() appearance?: 'always' | 'execute' | 'interaction-only' = 'always';
  @Input() retry?: 'never' | 'auto' = 'auto';
  @Input() size?: 'normal' | 'flexible' | 'compact' = 'normal';

  @Output() resolved = new EventEmitter<string | null>();

  private widgetId!: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  private _getCloudflareTurnstileUrl(): string {
    if (this.version === '0') {
      return 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    }

    throw 'Version not defined in ngx-turnstile component.';
  }

  public ngAfterViewInit(): void {
    let turnstileOptions: TurnstileOptions = {
      sitekey: this.siteKey,
      theme: this.theme,
      tabindex: this.tabIndex,
      action: this.action,
      cData: this.cData,
      appearance: this.appearance,
      retry: this.retry,
      size: this.size,
      callback: (token: string) => {
        this.zone.run(() => this.resolved.emit(token));
      },
      'expired-callback': () => {
        this.zone.run(() => this.reset());
      },
    };

    const script = document.createElement('script');

    window[CALLBACK_NAME] = () => {
      if (!this.elementRef?.nativeElement) {
        return;
      }

      this.widgetId = window.turnstile.render(
        this.elementRef.nativeElement,
        turnstileOptions,
      );
    };

    script.src = `${this._getCloudflareTurnstileUrl()}?render=explicit&onload=${CALLBACK_NAME}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
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
}
