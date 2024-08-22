import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {

  private isLoggedIn:boolean = false;
  private readonly idleTime: number = 3 ; // 3 minutes in seconds
  private readonly timeoutPeriod: number = 25; // 5 seconds warning before logout

  constructor(private idle: Idle, 
              private keepalive: Keepalive, 
              private router: Router, 
              private authService: AuthService) {

    this.idle.setIdle(this.idleTime); // Set idle time to 3 minutes
    this.idle.setTimeout(this.timeoutPeriod); // Set timeout period after idle
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // Set default interrupt sources (mouse, keyboard, touch, etc.)

    // Subscribe to idle timeout events
    this.idle.onTimeout.subscribe(() => {
      console.log("User is inactive. Logging out.");
      this.logout();
    });

    // Subscribe to idle end event (when user becomes active again)
    this.idle.onIdleEnd.subscribe(() => {
      console.log("User is active again. Resetting the idle timer.");
      this.reset();
    });

    // Subscribe to timeout warning event
    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      console.log(`You will be logged out in ${countdown} seconds!`);
    });

    // Start watching for idle state
    if (this.isLoggedIn) {
    this.reset();
    }
    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  
  }

  reset() {
    if (this.isLoggedIn) {
    this.idle.watch(); // Start or reset the idle watch
    console.log("Idle timer reset. Watching for user inactivity.");
    }
  }

  logout() {
    this.idle.stop(); // Stop watching for idle state
    this.authService.logout(); // Clear authentication tokens and handle logout
    this.router.navigate(['/login']); // Redirect to login page
    console.log("Logged out due to inactivity.");
  }
}
