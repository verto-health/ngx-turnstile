import { Directive, forwardRef, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxTurnstileComponent } from './ngx-turnstile.component';

@Directive({
  selector:
    'ngx-turnstile[formControl], ngx-turnstile[formControlName], ngx-turnstile[ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxTurnstileValueAccessorDirective),
      multi: true,
    },
  ],
})
export class NgxTurnstileValueAccessorDirective
  implements ControlValueAccessor, OnInit
{
  private onChange!: (value: string) => void;
  private onTouched!: () => void;
  private resolved: boolean = false;

  constructor(private turnstileComp: NgxTurnstileComponent) {}

  ngOnInit(): void {
    this.turnstileComp.resolved.subscribe((token: string) => {
      this.resolved = !!token;

      if (this.onChange) {
        this.onChange(token);
      }

      if (this.onTouched) {
        this.onTouched();
      }
    });
  }

  // Prevent form control from setting token value
  writeValue(value: any): void {
    // reset turnstile component if form control sets the value after already receiving a valid token
    if (this.resolved) {
      this.resolved = false;
      this.turnstileComp.reset();
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
