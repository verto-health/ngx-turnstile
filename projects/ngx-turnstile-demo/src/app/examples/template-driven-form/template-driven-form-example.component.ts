import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';

@Component({
  selector: 'app-reactive-form-example',
  standalone: true,
  template: ` <ng-container
    ><ngx-turnstile
      [siteKey]="siteKey"
      theme="light"
      [(ngModel)]="token"
    ></ngx-turnstile>

    <div class="p-1">Value: {{ token }}</div>
    <button
      type="button"
      class="btn btn-secondary btn-lg w-100 mb-3"
      (click)="setToInvalidValue()"
    >
      Set to Invalid Value
    </button>
  </ng-container>`,
  imports: [NgxTurnstileModule, NgxTurnstileFormsModule, FormsModule],
})
export class TemplateDrivenFormExampleComponent {
  token: string = '';

  siteKey = '1x00000000000000000000AA';

  setToInvalidValue() {
    this.token = 'this is an invalid value';
  }
}
