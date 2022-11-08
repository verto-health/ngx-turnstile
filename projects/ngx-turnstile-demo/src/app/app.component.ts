import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2em;
      }
      .example-container {
        display: flex;
        flex-direction: column;
        min-width: 19em;
        gap: 0.5em;
      }

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

      .route-active {
        color: black;
        font-size: 20px;
        transition: font-size 1s;
      }
    `,
  ],
  standalone: true,
  template: `
    <div class="container pt-5">
      <div class="example-container">
        <h5>Examples:</h5>
        <a
          routerLink=""
          [routerLinkActive]="['route-active']"
          [routerLinkActiveOptions]="{ exact: true }"
          >Event Binding Example</a
        >
        <a
          routerLink="/reactive-form-example"
          [routerLinkActive]="['route-active']"
          >Reactive Form Example</a
        >
        <a
          routerLink="/template-driven-form-example"
          [routerLinkActive]="['route-active']"
          >Template Driven Form Example</a
        >
      </div>
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

          <div class="checkbox">
            <!-- The following line controls and configures the Turnstile widget. -->
            <router-outlet></router-outlet>
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
  imports: [RouterModule],
})
export class AppComponent {}
