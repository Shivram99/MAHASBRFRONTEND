import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private router: Router, private ngZone: NgZone) {}

  handleError(error: any): void {
    console.error('Global Error:', error);

    // Run navigation inside Angular zone
    this.ngZone.run(() => {
      if (error instanceof HttpErrorResponse) {
        // Handle HTTP errors
        switch (error.status) {
          case 401:
            // Token expired or blacklisted
            this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
            break;
          case 403:
            // Forbidden
            this.router.navigate(['/unauthorized']);
            break;
          case 404:
            this.router.navigate(['/not-found']);
            break;
          default:
            // Server errors
            this.router.navigate(['/error']);
            break;
        }
      } else {
        // Handle client-side or unexpected errors
        this.router.navigate(['/error']);
      }
    });
  }
}
