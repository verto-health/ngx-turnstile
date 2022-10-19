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
        options: TurnstileOptions
      ) => string;
      reset: (widgetIdOrContainer: string | HTMLElement) => void;
      getResponse: (
        widgetIdOrContainer: string | HTMLElement
      ) => string | undefined;
      remove: (widgetIdOrContainer: string | HTMLElement) => void;
    };
  }
}

const global = globalThis ?? window;
let turnstileState =
  typeof (global as any).turnstile !== 'undefined' ? 'ready' : 'unloaded';

@Component({
  selector: 'ngx-turnstile',
  template: ``,
  exportAs: 'ngx-turnstile',
})
export class NgxTurnstileComponent implements AfterViewInit, OnDestroy {
  @Input() siteKey!: string;
  @Input() public action?: string;
  @Input() public cData?: string;
  @Input() public theme?: 'light' | 'dark' | 'auto';
  @Input() tabIndex?: number;

  @Output() resolved = new EventEmitter<string | null>();

  private widgetId!: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    let turnstileOptions: TurnstileOptions = {
      sitekey: this.siteKey,
      theme: this.theme,
      tabindex: this.tabIndex,
      action: this.action,
      cData: this.cData,
      callback: (token: string) => {
        this.zone.run(() => this.resolved.emit(token));
      },
      'expired-callback': () => {
        this.zone.run(() => this.resolved.emit(null));
      },
    };
    loadScript();

    if (turnstileState === 'ready') {
      window.onloadTurnstileCallback = () => {
        this.widgetId = window.turnstile.render(
          this.elementRef.nativeElement,
          turnstileOptions
        );
      };
    }
  }

  public ngOnDestroy(): void {
    window.turnstile.remove(this.widgetId);
  }
}

function loadScript() {
  if (turnstileState === 'unloaded') {
    turnstileState = 'loading';
    const script = document.createElement('script');
    const baseUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

    script.src = `${baseUrl}?render=explicit&onload=onloadTurnstileCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    turnstileState = 'ready';
  }
}
