import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [NgxTurnstileModule, NgIf, FormsModule],
})
export class MultiWidgetComponent {
  siteKey = '1x00000000000000000000AA';

  // Toggled by the checkbox to mount/unmount a widget on demand — reproduces
  // the conditional-render race from issue #49.
  showConditionalWidget = false;

  onResolved(widget: string, response: string | null) {
    console.log('onResolved', widget, response);
  }

  onErrored(widget: string, errorCode: string | null) {
    console.log('onErrored', widget, errorCode);
  }
}
