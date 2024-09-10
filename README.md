Some changes for the project

New changes

# Cloudflare Turnstile Component for Angular

## ngx-turnstile

An easy to use component for implementing [Cloudflare Turnstile](https://blog.cloudflare.com/turnstile-private-captcha-alternative/) in Angular.

## Installation

Add this library to your Angular project using npm or yarn.

```bash
yarn add ngx-turnstile
npm install ngx-turnstile --save
```

## Quickstart

To start, import the NgxTurnstileModule in your app module.

```typescript
// app.module.ts
import { NgxTurnstileModule } from "ngx-turnstile";
import { BrowserModule } from "@angular/platform-browser";
import { MyApp } from "./app.component.ts";

@NgModule({
  bootstrap: [MyApp],
  declarations: [MyApp],
  imports: [BrowserModule, NgxTurnstileModule],
})
export class MyAppModule {}
```

After that, you are free to use the component anywhere:

```typescript
// app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `<ngx-turnstile [siteKey]="siteKey" (resolved)="sendCaptchaResponse($event)" theme="auto" [tabIndex]="0"></ngx-turnstile>`,
})
export class MyApp {
  sendCaptchaResponse(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
```

## Usage with @angular/forms

Import both NgxTurnstileModule and NgxTurnstileFormsModule modules in your app module.

```typescript
import { NgxTurnstileModule, NgxTurnstileFormsModule } from "ngx-turnstile";
```

Then import either FormsModule or ReactiveFormsModule from @angular/forms depending on the type of form you want to use.

You can then use the ngModel, formControl or formControlName directives on the component depending on which module you imported from @angular/forms.

### Reactive Form Example

```html
<ngx-turnstile [siteKey]="siteKey" theme="auto" [formControl]="tokenControl"></ngx-turnstile>
```

### Template Driven Form Example

```html
<ngx-turnstile [siteKey]="siteKey" theme="light" [(ngModel)]="token"></ngx-turnstile>
```

The component is read-only, meaning that you should not update the control with a custom value. Updating the control value will reset the component

## API

The component supports these options as input:

- `siteKey`
- `action`
- `cData`
- `theme`
- `tabIndex`

These options are well documented in the [Cloudflare Docs](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations). The letter cases are adapted to camelCase to facilitate easy migration from `ng-recaptcha`.

### Events

- `resolved(response: string)`. Occurs when the CAPTCHA resolution value changed.
- `errored(errorCode: string)`. Occurs when the CAPTCHA widget returned an [error code](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/#error-codes).

### Example

For those who prefer examples over documentation, simply clone the repository and run

```bash
$ yarn install
$ ng build ngx-turnstile
$ ng serve ngx-turnstile-demo
```
