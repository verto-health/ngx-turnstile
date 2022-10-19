import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTurnstileModule } from 'ngx-turnstile';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgxTurnstileModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
