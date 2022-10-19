import { Component } from '@angular/core';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-root',
  styles: [
    `
      .form-signin {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
      }

      .form-signin .checkbox {
        font-weight: 400;
      }

      .form-signin .form-floating:focus-within {
        z-index: 2;
      }

      .form-signin input[type='text'] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      .form-signin input[type='password'] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    `,
  ],
  standalone: true,
  template: `
    <div class="container pt-5">
      <main class="form-signin">
        <form action="https://demo.turnstile.workers.dev/handler" method="POST">
          <h2 class="h3 mb-3 fw-normal">Turnstile &dash; Dummy Login Demo</h2>

          <div class="form-floating">
            <input type="text" id="user" class="form-control" />
            <label for="user">User name</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              id="pass"
              class="form-control"
              autocomplete="off"
              readonly
              value="CorrectHorseBatteryStaple"
            />
            <label for="pass">Password (dummy)</label>
          </div>

          <div class="checkbox mb-3">
            <!-- The following line controls and configures the Turnstile widget. -->
            <ngx-turnstile
              [siteKey]="siteKey"
              theme="light"
              (resolved)="onResolved($event)"
            ></ngx-turnstile>
            <!-- end. -->
          </div>
          <button class="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
          <p class="mt-5 mb-3 text-muted">
            <a
              target="_blank"
              href="https://github.com/verto-health/ngx-turnstile"
            >
              <i class="bi bi-github"></i> See code
            </a>
          </p>
        </form>
      </main>
    </div>
  `,
  imports: [NgxTurnstileModule],
})
export class AppComponent {
  siteKey = '1x00000000000000000000AA';

  onResolved(response: string | null) {
    console.log(response);
  }
}
