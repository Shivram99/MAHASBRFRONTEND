import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../interface/AuthResponse';
import { User } from '../interface/user';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly helper = new JwtHelperService();
  private readonly commonPostLoginProfileRoute = '/common-post-login/profile';
  private readonly roleHomeRoutes: Array<{ role: string; route: string }> = [
    { role: 'ROLE_DEVELOPER', route: '/developer/developerDashboard' },
    { role: 'ROLE_MODERATOR', route: '/admin/dashboardadmin' },
    { role: 'ROLE_DES_STATE', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_DES_REGION', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_DES_DISTRICT', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_REG_AUTH_API', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_REG_AUTH_CSV', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_USER', route: '/dashboard' }
  ];

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private readonly rolesSubject = new BehaviorSubject<string[]>([]);
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.isLoggedInSubject.next(this.hasValidToken());
      this.rolesSubject.next(this.getRolesFromToken());

      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(username: string, password: string, recaptchaResponse: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/signin`, {
      username,
      password,
      recaptchaResponse
    }).pipe(
      tap((response) => {
        this.currentUserSubject.next(response.user);
        this.setSession(response.token);
        if (this.isBrowser) {
          sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http.post<{ message?: string }>(`${environment.apiUrl}/api/auth/logout`, {})
      .pipe(
        catchError((error) => {
          console.error('Backend logout failed:', error);
          return of(null);
        }),
        finalize(() => {
          this.completeLogout();
          void this.router.navigateByUrl('/');
        })
      )
      .subscribe((response) => {
        if (response?.message) {
          console.log(response.message);
        }
      });
  }

  private setSession(token: string | undefined): void {
    if (!this.isBrowser) {
      return;
    }

    if (!token || token.trim() === '') {
      this.completeLogout();
      return;
    }

    this.tokenStorage.saveToken(token);
    this.isLoggedInSubject.next(true);
    this.rolesSubject.next(this.getRolesFromToken());
  }

  private clearSession(): void {
    if (!this.isBrowser) {
      return;
    }

    this.isLoggedInSubject.next(false);
    this.rolesSubject.next([]);
  }

  private completeLogout(): void {
    if (!this.isBrowser) {
      return;
    }

    this.tokenStorage.removeToken();
    this.clearSession();
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('roles');
  }

  getToken(): string | null {
    return this.isBrowser ? this.tokenStorage.getToken() : null;
  }

  isAuthenticated(): boolean {
    return this.isBrowser && this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return false;
    }

    try {
      return !this.helper.isTokenExpired(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }

  private getRolesFromToken(): string[] {
    const token = this.getToken();

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return [];
    }

    try {
      const decoded = this.helper.decodeToken(token) as { roles?: string[] } | null;
      return decoded?.roles ?? [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserRolesObservable(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  getUserRoles(): string[] {
    return this.rolesSubject.value;
  }

  getDefaultHomeRoute(roles: string[] = this.getUserRoles()): string | null {
    const matchedRoute = this.roleHomeRoutes.find(({ role }) => roles.includes(role));
    return matchedRoute?.route ?? null;
  }

  getFallbackHomeRoute(roles: string[] = this.getUserRoles()): string | null {
    const commonPostLoginRoles = [
      'ROLE_ADMIN',
      'ROLE_DES_STATE',
      'ROLE_DES_REGION',
      'ROLE_DES_DISTRICT',
      'ROLE_REG_AUTH_API',
      'ROLE_REG_AUTH_CSV'
    ];

    return roles.some((role) => commonPostLoginRoles.includes(role))
      ? this.commonPostLoginProfileRoute
      : null;
  }

  getResolvedHomeRoute(roles: string[] = this.getUserRoles()): string | null {
    return this.getDefaultHomeRoute(roles) ?? this.getFallbackHomeRoute(roles);
  }

  async navigateToPostLoginHome(roles: string[] = this.getUserRoles()): Promise<boolean> {
    const defaultHomeRoute = this.getDefaultHomeRoute(roles);

    if (defaultHomeRoute) {
      const navigated = await this.router.navigateByUrl(defaultHomeRoute);
      if (navigated) {
        return true;
      }
    }

    const fallbackHomeRoute = this.getFallbackHomeRoute(roles);
    if (fallbackHomeRoute) {
      return this.router.navigateByUrl(fallbackHomeRoute);
    }

    return this.router.navigateByUrl('/unauthorized');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setUser(user: User): void {
    if (this.isBrowser) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }
}
