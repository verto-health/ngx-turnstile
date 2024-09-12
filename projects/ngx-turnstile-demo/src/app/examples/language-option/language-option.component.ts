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
        [language]="language"
      ></ngx-turnstile>
    </ng-container>
  `,
  imports: [NgxTurnstileModule],
})
export class LanguageOptionComponent {
  siteKey = '1x00000000000000000000AA';
  language = 'FR';
}
