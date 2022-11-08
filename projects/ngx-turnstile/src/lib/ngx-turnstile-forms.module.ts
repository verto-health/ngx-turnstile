import { NgModule } from '@angular/core';
import { NgxTurnstileValueAccessorDirective } from './ngx-turnstile-value-accessor.directive';
import { NgxTurnstileModule } from './ngx-turnstile.module';

@NgModule({
  declarations: [NgxTurnstileValueAccessorDirective],
  imports: [NgxTurnstileModule],
  exports: [NgxTurnstileValueAccessorDirective],
})
export class NgxTurnstileFormsModule {}
