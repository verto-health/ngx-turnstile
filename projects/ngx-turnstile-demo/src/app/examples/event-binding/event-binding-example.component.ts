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
      ></ngx-turnstile>
    </ng-container>
  `,
  imports: [NgxTurnstileModule],
})
export class EventBindingExampleComponent {
  siteKey = '1x00000000000000000000AA';

  onResolved(response: string | null) {
    console.log('onResolved', response);
  }

  onErrored(errorCode: string | null) {
    console.log('onErrored', errorCode);
  }
}
