import { NgModule } from '@angular/core';
import { NgxTurnstileValueAccessorDirective } from './ngx-turnstile-value-accessor.directive';
import { NgxTurnstileModule } from './ngx-turnstile.module';

@NgModule({
  imports: [NgxTurnstileModule, NgxTurnstileValueAccessorDirective],
  exports: [NgxTurnstileValueAccessorDirective],
})
export class NgxTurnstileFormsModule {}
