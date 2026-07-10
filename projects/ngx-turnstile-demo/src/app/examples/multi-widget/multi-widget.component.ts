import { Component } from '@angular/core';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-multi-widget-example',
  standalone: true,
  template: `
    <ng-container>
      <p>Both widgets below should render on the same page.</p>
      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        (resolved)="onResolved('widget-1', $event)"
        (errored)="onErrored('widget-1', $event)"
      ></ngx-turnstile>
      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        (resolved)="onResolved('widget-2', $event)"
        (errored)="onErrored('widget-2', $event)"
      ></ngx-turnstile>
    </ng-container>
  `,
  imports: [NgxTurnstileModule],
})
export class MultiWidgetComponent {
  siteKey = '1x00000000000000000000AA';

  onResolved(widget: string, response: string | null) {
    console.log('onResolved', widget, response);
  }

  onErrored(widget: string, errorCode: string | null) {
    console.log('onErrored', widget, errorCode);
  }
}
