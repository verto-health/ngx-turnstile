import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';
import { ActivatedRoute, Router } from '@angular/router';

type TurnstileSize = 'normal' | 'flexible' | 'compact';

@Component({
  selector: 'app-different-size',
  standalone: true,
  template: `
    <ng-container>
      <div class="mb-3">
        <label for="sizeSelect" class="form-label">Widget Size</label>
        <select
          id="sizeSelect"
          class="form-select"
          [ngModel]="size"
          (ngModelChange)="onSizeChange($event)"
          name="size"
        >
          <option value="normal">Normal</option>
          <option value="flexible">Flexible</option>
          <option value="compact">Compact</option>
        </select>
      </div>

      <ngx-turnstile
        [siteKey]="siteKey"
        theme="light"
        [size]="size"
        [(ngModel)]="token"
      ></ngx-turnstile>
    </ng-container>
  `,
  imports: [NgxTurnstileModule, NgxTurnstileFormsModule, FormsModule],
})
export class DifferentSizeComponent {
  token: string = '';
  siteKey = '1x00000000000000000000AA';
  size: TurnstileSize = 'normal';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const sizeParam = params.get('size');
      if (
        sizeParam === 'normal' ||
        sizeParam === 'flexible' ||
        sizeParam === 'compact'
      ) {
        this.size = sizeParam as TurnstileSize;
      } else {
        this.size = 'normal';
      }
    });
  }

  onSizeChange(newSize: TurnstileSize) {
    this.router
      .navigate([], {
        queryParams: { size: newSize },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      })
      .then(() => {
        window.location.reload();
      });
  }
}
