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

To start, import the TurnstileModule in your app module.

```typescript
// app.module.ts
import { TurnstileModule } from "ngx-turnstile";
import { BrowserModule } from "@angular/platform-browser";
import { MyApp } from "./app.component.ts";

@NgModule({
  bootstrap: [MyApp],
  declarations: [MyApp],
  imports: [BrowserModule, TurnstileModule],
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

## API

The component supports these options as input:

- `siteKey`
- `action`
- `cData`
- `theme`
- `language`
- `tabIndex`
- `appearance`
- `retry`
- `retryInterval`
- `size`
- `refreshExpired`
- `refreshTimeout`
- `execution`
- `feedbackEnabled`

These options are well documented in the [Cloudflare Docs](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations). The letter cases are adapted to camelCase to facilitate easy migration from `ng-recaptcha`.

### Events

- `resolved(response: string)`. Occurs upon success of the challenge. The callback is passed a token that can be validated. eg. `callback`
- `errored(response: string)`. Occurs when there is an error (e.g. network error or the challenge failed). Refer to [Client-side errors](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/#error-codes). eg. `error-callback`
- `expired(response: string)`. Occurs when the token expires and does not reset the widget. eg. `expired-callback`
- `timedOut()`. Occurs when the challenge presents an interactive challenge but was not solved within a given time. eg. `timeout-callback`
- `beforeInteractive()`. Occurs before the challenge enters interactive mode. eg. `before-interactive-callback`
- `afterInteractive()`. Occurs when challenge has left interactive mode. eg. `after-interactive-callback`
- `unsupported()`. Occurs when a given client/browser is not supported by Turnstile. eg. `unsupported-callback`

### Example

For those who prefer examples over documentation, simply clone the repository and run

```bash
$ yarn install
$ ng build ngx-turnstile
$ ng serve ngx-turnstile-demo
```
