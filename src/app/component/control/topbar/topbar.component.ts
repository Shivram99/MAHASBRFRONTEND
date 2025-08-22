import { Component } from '@angular/core';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css',
    standalone: false
})
export class TopbarComponent {
 emblemImg : string = 'assets/images/emblem.png';

 isLoggedIn: boolean = false;
}
