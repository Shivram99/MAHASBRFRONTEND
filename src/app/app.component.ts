import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { VisitTrackerService } from './services/sitevisitor/visit-tracker.service';
import { VisitSummary } from './interface/visit-summary';

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
  summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };
  constructor(private authService: AuthService,private visitService: VisitTrackerService) {}

  ngOnInit() {
    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
      
  }

  private loadSummary(): void {
    this.visitService.getVisitSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        console.error('Error loading summary', err);
      }
    });
  }
}