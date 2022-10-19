import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  siteKey = "1x00000000000000000000AA";

  onResolved(response: string | null) {
    console.log(response);
  }
}
