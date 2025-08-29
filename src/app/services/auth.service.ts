import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'accessToken';
  private helper = new JwtHelperService();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private rolesSubject = new BehaviorSubject<string[]>(this.getRolesFromToken());

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.isLoggedInSubject.next(this.hasValidToken());
      this.rolesSubject.next(this.getRolesFromToken());
    }
  }

  // 🔹 Login and store tokens
  login(username: string, password: string, recaptchaResponse: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/signin`, {
      username,
      password,
      recaptchaResponse
    }).pipe(
      tap(response => {
        this.setSession(response.accessToken);
      }),
      catchError(this.handleError)
    );
  }

  // 🔹 Refresh token API
  // refreshAccessToken() {
  //   const refreshToken = this.getRefreshToken();
  //   if (!refreshToken) return throwError(() => new Error('No refresh token available'));

  //   return this.http.post<any>(`${environment.apiUrl}/api/auth/refresh`, { refreshToken })
  //     .pipe(
  //       tap(response => {
  //         this.setSession(response.accessToken, response.refreshToken);
  //       }),
  //       catchError(err => {
  //         this.logout();
  //         return throwError(() => err);
  //       })
  //     );
  // }

  private setSession(token: string): void {
    debugger
    if (!this.isBrowser) return;

    sessionStorage.setItem(this.authTokenKey, token);
    this.isLoggedInSubject.next(true);
    this.rolesSubject.next(this.getRolesFromToken());
  }

  logout(): void {
    debugger
    if (!this.isBrowser) return;

    this.clearSession();

  }

  private clearSession(): void {
    sessionStorage.removeItem(this.authTokenKey);
    this.isLoggedInSubject.next(false);
    this.rolesSubject.next(['ROLE_USER']);
    // this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return sessionStorage.getItem(this.authTokenKey);
  }

  // 🔹 Automatically refresh token if expired
  getValidAccessToken() {
    const token = this.getToken();

    return [token];
  }

  isAuthenticated(): boolean {
    return this.isBrowser && this.hasValidToken();
  }

  getIsLoggedIn() {
    return this.isLoggedInSubject.asObservable();  }

  getUserRolesObservable() {
    return this.rolesSubject.asObservable();
  }

  getUserRoles(): string[] {
    return this.rolesSubject.value;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.helper.isTokenExpired(token);
  }

  private getRolesFromToken(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded = this.helper.decodeToken(token);
    return decoded?.roles || [];
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error:', error);
    return throwError(() => error);
  }
}