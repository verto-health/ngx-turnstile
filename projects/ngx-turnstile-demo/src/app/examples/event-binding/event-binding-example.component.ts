import { Component } from '@angular/core';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-regular-example',
  standalone: true,
  template: `
    <ng-container>
      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        (resolved)="onResolved($event)"
        (errored)="onErrored($event)"
        (expired)="onExpired($event)"
        (timedOut)="onTimeout()"
        (beforeInteractive)="beforeInteractive()"
        (afterInteractive)="afterInteractive()"
        (onUnsupported)="onUnsupported()"
      ></ngx-turnstile>
    </ng-container>
  `,
  imports: [NgxTurnstileModule],
})
export class EventBindingExampleComponent {
  siteKey = '1x00000000000000000000AA';

  onResolved(token: string | null) {
    console.log('onResolved', token);
  }

  onErrored(errorCode: string | null) {
    console.log('onErrored', errorCode);
  }

  onExpired(token: string | null) {
    console.log('onExpired', token);
  }

  onTimeout() {
    console.log('onTimeout');
  }

  beforeInteractive() {
    console.log('beforeInteractive');
  }

  afterInteractive() {
    console.log('afterInteractive');
  }

  onUnsupported() {
    console.log('onUnsupported');
  }
}
