import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../auth-interceptor.interceptor';
import { AuthResponse } from '../interface/AuthResponse';
import { ApiResponse } from '../interface/api-response';
import { MenuDTO } from '../interface/menu-dto';
import { User } from '../interface/user';
import { TokenStorageService } from './token-storage.service';

export type SessionValidationState = 'valid' | 'invalid' | 'unavailable';

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
  private sessionValidationRequest$: Observable<SessionValidationState> | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      if (this.hasValidToken()) {
        this.syncSessionState();

        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
          this.currentUserSubject.next(JSON.parse(storedUser));
        }
      } else {
        this.completeLogout();
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

  handleInvalidSession(redirectTo: 'login' | 'home' | null = 'login'): void {
    this.completeLogout();

    if (!this.isBrowser || redirectTo === null) {
      return;
    }

    if (redirectTo === 'home') {
      void this.router.navigateByUrl('/');
      return;
    }

    void this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
  }

  getToken(): string | null {
    return this.isBrowser ? this.tokenStorage.getToken() : null;
  }

  isAuthenticated(): boolean {
    return this.isBrowser && this.hasValidToken();
  }

  validateSession(): Observable<SessionValidationState> {
    if (!this.isBrowser || !this.hasValidToken()) {
      this.completeLogout();
      return of('invalid');
    }

    if (!this.sessionValidationRequest$) {
      this.sessionValidationRequest$ = this.http.get<ApiResponse<MenuDTO[]>>(
        `${environment.apiUrl}/citizenSearch/menus/my`,
        {
          context: new HttpContext().set(SKIP_AUTH_REDIRECT, true)
        }
      ).pipe(
        map(() => {
          this.syncSessionState();
          return 'valid' as const;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.handleInvalidSession(null);
            return of('invalid' as const);
          }

          if (error.status === 0 || error.status >= 500) {
            this.handleBackendUnavailable(null);
            return of('unavailable' as const);
          }

          return of('valid' as const);
        }),
        finalize(() => {
          this.sessionValidationRequest$ = null;
        }),
        shareReplay(1)
      );
    }

    return this.sessionValidationRequest$;
  }

  handleBackendUnavailable(redirectTo: 'home' | null = 'home'): void {
    this.completeLogout();

    if (!this.isBrowser || redirectTo === null) {
      return;
    }

    void this.router.navigateByUrl('/');
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

  navigateToUnauthorized(): Promise<boolean> {
    return this.router.navigateByUrl('/unauthorized');
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

  private setSession(token: string | undefined): void {
    if (!this.isBrowser) {
      return;
    }

    if (!token || token.trim() === '') {
      this.completeLogout();
      return;
    }

    this.tokenStorage.saveToken(token);
    this.syncSessionState();
  }

  private completeLogout(): void {
    if (!this.isBrowser) {
      return;
    }

    this.sessionValidationRequest$ = null;
    this.tokenStorage.removeToken();
    this.isLoggedInSubject.next(false);
    this.rolesSubject.next([]);
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('roles');
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

  private syncSessionState(): void {
    if (!this.isBrowser) {
      return;
    }

    const isLoggedIn = this.hasValidToken();
    this.isLoggedInSubject.next(isLoggedIn);
    this.rolesSubject.next(isLoggedIn ? this.getRolesFromToken() : []);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }
}
