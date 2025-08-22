import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements OnInit {
  
  title = 'MahaSbrFrontend';
  isLoggedIn: boolean = false;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}