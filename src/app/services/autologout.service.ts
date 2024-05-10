import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutologoutService {
  private readonly inactivityThreshold = 5 * 60 * 1000; // 5 minutes
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  private logoutEvent = new Subject<void>();

  constructor(private router: Router) {
    this.checkUserActivity();
  }

  private checkUserActivity(): void {
    document.addEventListener('mousemove', () => {
      this.resetTimer();
    });

    document.addEventListener('keypress', () => {
      this.resetTimer();
    });

    this.resetTimer();
  }

  private resetTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logoutEvent.next();
    }, this.inactivityThreshold);
  }

  start(): void {
    this.resetTimer();
  }

  stop(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  getLogoutEvent(): Subject<void> {
    return this.logoutEvent;
  }
}