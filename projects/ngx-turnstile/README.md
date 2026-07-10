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

`NgxTurnstileComponent` is a standalone component. Import it directly into any standalone component (or `NgModule`) that needs it:

```typescript
// app.component.ts
import { Component } from "@angular/core";
import { NgxTurnstileComponent } from "ngx-turnstile";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [NgxTurnstileComponent],
  template: `<ngx-turnstile [siteKey]="siteKey" (resolved)="sendCaptchaResponse($event)" theme="auto" [tabIndex]="0"></ngx-turnstile>`,
})
export class MyApp {
  siteKey = "<YOUR_SITE_KEY>";

  sendCaptchaResponse(captchaResponse: string | null) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
```

If you use `NgModule`s, you can instead import `NgxTurnstileModule`:

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

## Usage with @angular/forms

Import both `NgxTurnstileModule` and `NgxTurnstileFormsModule` modules in your app module.

```typescript
import { NgxTurnstileModule, NgxTurnstileFormsModule } from "ngx-turnstile";
```

Then import either `FormsModule` or `ReactiveFormsModule` from `@angular/forms` depending on the type of form you want to use.

You can then use the `ngModel`, `formControl` or `formControlName` directives on the component depending on which module you imported from `@angular/forms`.

### Reactive Form Example

```html
<ngx-turnstile [siteKey]="siteKey" theme="auto" [formControl]="tokenControl"></ngx-turnstile>
```

### Template Driven Form Example

```html
<ngx-turnstile [siteKey]="siteKey" theme="light" [(ngModel)]="token"></ngx-turnstile>
```

The component is read-only, meaning that you should not update the control with a custom value. Updating the control value will reset the component.

## API

### Inputs

The letter cases are adapted to camelCase to facilitate easy migration from `ng-recaptcha`. Each input maps to the corresponding [Cloudflare render parameter](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/).

| Input                 | Type                                          | Default                   | Description                                                                                                                                                                             |
| --------------------- | --------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `siteKey`             | `string` (required)                           | —                         | Your widget's sitekey, created when the widget is created.                                                                                                                              |
| `action`              | `string`                                      | —                         | A customer value to differentiate widgets under the same sitekey (up to 32 chars: alphanumeric, `_`, `-`). Returned upon validation.                                                    |
| `cData`               | `string`                                      | —                         | A customer payload attached to the challenge (up to 255 chars: alphanumeric, `_`, `-`). Returned upon validation.                                                                       |
| `theme`               | `'light' \| 'dark' \| 'auto'`                 | `'auto'`                  | Widget theme. `auto` respects the visitor's preference.                                                                                                                                 |
| `language`            | `string`                                      | `'auto'`                  | `auto`, or an ISO 639-1 code (e.g. `en`) / language-country code (e.g. `en-US`). See [supported languages](https://developers.cloudflare.com/turnstile/reference/supported-languages/). |
| `tabIndex`            | `number`                                      | `0`                       | The `tabindex` of Turnstile's iframe for accessibility.                                                                                                                                 |
| `appearance`          | `'always' \| 'execute' \| 'interaction-only'` | `'always'`                | Controls when the widget is visible. See [Appearance modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#appearance-modes).                           |
| `execution`           | `'render' \| 'execute'`                       | `'render'`                | Controls when to obtain the token. See [Execution modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes).                               |
| `retry`               | `'auto' \| 'never'`                           | `'auto'`                  | Whether the widget automatically retries to obtain a token on failure.                                                                                                                  |
| `retryInterval`       | `number`                                      | `8000`                    | When `retry` is `auto`, the time between retry attempts in ms. Positive integer less than `900000`.                                                                                     |
| `refreshExpired`      | `'auto' \| 'manual' \| 'never'`               | `'auto'`                  | Behavior when the token expires.                                                                                                                                                        |
| `refreshTimeout`      | `'auto' \| 'manual' \| 'never'`               | `'auto'`                  | Behavior when an interactive challenge times out. Only applies to widgets in Managed mode.                                                                                              |
| `size`                | `'normal' \| 'flexible' \| 'compact'`         | `'normal'`                | Widget size.                                                                                                                                                                            |
| `responseField`       | `boolean`                                     | `true`                    | Whether to create a hidden input element containing the response token.                                                                                                                 |
| `responseFieldName`   | `string`                                      | `'cf-turnstile-response'` | Name of the hidden input element.                                                                                                                                                       |
| `feedbackEnabled`     | `boolean`                                     | `true`                    | Allows Cloudflare to gather visitor feedback upon widget failure.                                                                                                                       |
| `offlabelShowPrivacy` | `boolean`                                     | `true`                    | Displays the privacy link for unbranded Turnstile widgets.                                                                                                                              |
| `offlabelShowHelp`    | `boolean`                                     | `true`                    | Displays the help link for unbranded Turnstile widgets.                                                                                                                                 |

### Outputs

| Output              | Payload          | Description                                                                                                                                   |
| ------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `resolved`          | `string \| null` | Emitted when the CAPTCHA resolution value changes. Emits `null` when the widget is reset (e.g. on token expiry).                              |
| `errored`           | `string \| null` | Emitted when the widget returns an [error code](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/#error-codes). |
| `beforeInteractive` | `void`           | Emitted before the challenge enters interactive mode.                                                                                         |
| `afterInteractive`  | `void`           | Emitted when the challenge has left interactive mode.                                                                                         |
| `unsupported`       | `void`           | Emitted when the visitor's browser is not supported by Turnstile.                                                                             |
| `timeout`           | `void`           | Emitted when an interactive challenge is not solved within the allotted time.                                                                 |

When the token expires, the component automatically resets the widget and emits `resolved(null)`. Use `refreshExpired` to opt into Cloudflare's native refresh handling.

### Example

For those who prefer examples over documentation, simply clone the repository and run

```bash
$ yarn install
$ ng build ngx-turnstile
$ ng serve ngx-turnstile-demo
```
