import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes';

import { environment } from './environments/environment';

function overWriteAttachShadowToPreventClosedShadowDoms() {
  const og = HTMLDivElement.prototype.attachShadow;
  HTMLDivElement.prototype.attachShadow = function (options: ShadowRootInit) {
    if (options.mode === 'closed') {
      options.mode = 'open';
    }
    return og.call(this, options);
  };
}
overWriteAttachShadowToPreventClosedShadowDoms(); // Open shadow DOMS to enable cypress testing

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(APP_ROUTES)],
});
