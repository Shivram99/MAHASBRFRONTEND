import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { notifyWarning } from '../shared/utils/notify';

/**
 * Logs the user out after a period of inactivity.
 *
 * - Starts by itself whenever someone is logged in (also after a page refresh) and stops at logout.
 * - After IDLE_SECONDS without mouse, keyboard or touch activity a popup warns the user and counts
 *   down WARNING_SECONDS; any activity, or "Stay logged in", cancels it. If nothing happens the user
 *   is logged out.
 */
@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {

  /** Inactivity before the warning appears. */
  static readonly IDLE_SECONDS = 15 * 60;
  /** How long the warning counts down before the user is logged out. */
  static readonly WARNING_SECONDS = 60;

  private isLoggedIn = false;
  private warningOpen = false;
  private readonly isBrowser: boolean;

  constructor(private idle: Idle,
              private authService: AuthService,
              @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) {
      return;
    }

    this.idle.setIdle(IdleTimeoutService.IDLE_SECONDS);
    this.idle.setTimeout(IdleTimeoutService.WARNING_SECONDS);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeoutWarning.subscribe((secondsLeft: number) => this.showWarning(secondsLeft));
    this.idle.onIdleEnd.subscribe(() => this.closeWarning());
    this.idle.onTimeout.subscribe(() => this.timeOut());

    // Follow the login state: watch while logged in, stop when logged out.
    this.authService.getIsLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.idle.watch();
      } else {
        this.idle.stop();
        this.closeWarning();
      }
    });
  }

  /** Restarts the inactivity timer (e.g. right after login). */
  reset(): void {
    if (this.isBrowser && this.isLoggedIn) {
      this.idle.watch();
    }
  }

  private showWarning(secondsLeft: number): void {
    if (!this.warningOpen) {
      this.warningOpen = true;
      void Swal.fire({
        icon: 'warning',
        title: 'Are you still there?',
        html: `You will be logged out in <b id="idle-countdown">${this.format(secondsLeft)}</b> because of inactivity.`,
        confirmButtonText: 'Stay logged in',
        allowOutsideClick: false
      }).then((result) => {
        this.warningOpen = false;
        if (result.isConfirmed) {
          this.reset();
        }
      });
    } else {
      const countdown = Swal.getHtmlContainer()?.querySelector('#idle-countdown');
      if (countdown) {
        countdown.textContent = this.format(secondsLeft);
      }
    }
  }

  private closeWarning(): void {
    if (this.warningOpen) {
      this.warningOpen = false;
      Swal.close();
    }
  }

  private timeOut(): void {
    this.closeWarning();
    this.idle.stop();
    this.authService.logout();   // also invalidates the token on the server
    void notifyWarning('You were logged out because there was no activity. Please log in again.', 'Session ended');
  }

  private format(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
}
