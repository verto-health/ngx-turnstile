import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-reactive-form-example',
  standalone: true,
  template: ` <ng-container>
    <ngx-turnstile
      [siteKey]="siteKey"
      theme="light"
      [formControl]="tokenControl"
    ></ngx-turnstile>

    <div class="p-1">Value: {{ tokenControl.value }}</div>
    <button
      type="button"
      class="btn btn-secondary btn-lg w-100 mb-3"
      (click)="setToInvalidValue()"
    >
      Set to Invalid Value
    </button>
    <button
      type="button"
      class="btn btn-secondary btn-lg w-100 mb-3"
      (click)="tokenControl.reset()"
    >
      Reset Form Control
    </button>
  </ng-container>`,
  imports: [NgxTurnstileModule, NgxTurnstileFormsModule, ReactiveFormsModule],
})
export class ReactiveFormExampleComponent implements OnInit {
  siteKey = '1x00000000000000000000AA';
  tokenControl = new FormControl();

  ngOnInit(): void {
    this.tokenControl = new FormControl();
  }

  setToInvalidValue() {
    this.tokenControl.setValue('this is an invalid value');
  }
}
