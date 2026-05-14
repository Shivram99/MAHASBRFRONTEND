import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TokenStorageService } from './services/token-storage.service';

export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private injector: Injector
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();
    const isSignInRequest = req.url.includes('/api/auth/signin');
    const skipAuthRedirect = req.context.get(SKIP_AUTH_REDIRECT);

    const request = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token && !isSignInRequest && !skipAuthRedirect) {
          this.injector.get(AuthService).handleInvalidSession('login');
        }

        if ((error.status === 0 || error.status >= 500) && token && !isSignInRequest && !skipAuthRedirect) {
          this.injector.get(AuthService).handleBackendUnavailable('home');
        }

        if (error.status === 403) {
          void this.injector.get(AuthService).navigateToUnauthorized();
        }

        return throwError(() => error);
      })
    );
  }
}
