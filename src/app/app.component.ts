import { Component } from '@angular/core';
import { IdleTimeoutService } from './services/idle-timeout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent {
  title = 'MahaSbrFrontend';

  // Injected here so the inactivity timer runs on every page and after a refresh,
  // not only after visiting the login page.
  constructor(_idleTimeout: IdleTimeoutService) {}
}
