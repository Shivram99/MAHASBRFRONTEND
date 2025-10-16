
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenStorageService } from './services/token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();
    let cloned = req;

    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // return next.handle(cloned);
  //    return next.handle(cloned).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       // Stop loader if any
  //       this.loaderService.hide();

  //       // 401 = Unauthorized (invalid/blacklisted token or expired)
  //       if (error.status === 401) {
  //         console.warn('Unauthorized request detected. Logging out user.');

  //         // Clear token from storage
  //         this.tokenStorage.removeToken();

  //         // Redirect to login page with sessionExpired query param
  //         this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
  //       }

  //       return throwError(() => error);
  //     })
  //   );
  
  // }
   return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // 1️⃣ Token expired or blacklisted
        if (error.status === 401) {
          this.tokenStorage.removeToken();
          this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
        }

        // 2️⃣ Optionally handle forbidden
        if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }
}