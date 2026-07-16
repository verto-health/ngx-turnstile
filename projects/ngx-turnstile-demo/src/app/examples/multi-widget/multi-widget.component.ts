import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
    selector: 'app-multi-widget-example',
    template: `
    <ng-container>
      <p>
        A normally-rendered widget and a conditionally-rendered one. Both should
        render on the same page; toggling the checkbox mounts/unmounts the
        second one.
      </p>

      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        (resolved)="onResolved('widget-normal', $event)"
        (errored)="onErrored('widget-normal', $event)"
      ></ngx-turnstile>

      <label>
        <input
          type="checkbox"
          data-cy="toggle-conditional-widget"
          [(ngModel)]="showConditionalWidget"
        />
        Show conditionally-rendered widget
      </label>

      <ngx-turnstile
        *ngIf="showConditionalWidget"
        [siteKey]="siteKey"
        theme="light"
        (resolved)="onResolved('widget-conditional', $event)"
        (errored)="onErrored('widget-conditional', $event)"
      ></ngx-turnstile>
    </ng-container>
  `,
    imports: [NgxTurnstileModule, NgIf, FormsModule]
})
export class MultiWidgetComponent {
  siteKey = '1x00000000000000000000AA';

  // Rendered on load so both widgets mount together (exercises the shared
  // script-load callback), and toggled off/on to reproduce the
  // conditional-render race from issue #49.
  showConditionalWidget = true;

  onResolved(widget: string, response: string | null) {
    console.log('onResolved', widget, response);
  }

  onErrored(widget: string, errorCode: string | null) {
    console.log('onErrored', widget, errorCode);
  }
}
