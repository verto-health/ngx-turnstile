import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-regular-example',
  template: `
    <ng-container>
      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        [language]="language"
      ></ngx-turnstile>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTurnstileModule],
})
export class LanguageOptionComponent {
  siteKey = '1x00000000000000000000AA';
  language = 'FR';
}
