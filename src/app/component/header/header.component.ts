import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent {
  readonly environmentLabel = environment.environmentName.toUpperCase();
  readonly environmentClass = `env-badge--${environment.environmentName}`;
  readonly mh_logo = 'assets/images/DES_Logo.png';
}
