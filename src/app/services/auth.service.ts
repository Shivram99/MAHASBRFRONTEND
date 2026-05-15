import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, finalize, firstValueFrom, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../auth-interceptor.interceptor';
import { AuthResponse } from '../interface/AuthResponse';
import { ApiResponse } from '../interface/api-response';
import { LoggedInUser } from '../interface/logged-in-user';
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
  private readonly activeRolePriority = [
    'ROLE_ADMIN',
    'ROLE_DES_STATE',
    'ROLE_DES_REGION',
    'ROLE_DES_DISTRICT',
    'ROLE_REG_AUTH_API',
    'ROLE_REG_AUTH_CSV',
    'ROLE_MODERATOR',
    'ROLE_DEVELOPER',
    'ROLE_USER'
  ];
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
  private readonly currentUserSubject = new BehaviorSubject<LoggedInUser | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isBrowser: boolean;
  private sessionValidationRequest$: Observable<SessionValidationState> | null = null;
  private currentUserRequest$: Observable<LoggedInUser | null> | null = null;

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
        this.setCurrentUserState(this.getStoredCurrentUser(), false);
      } else {
        this.completeLogout();
      }
    }
  }

  async initialize(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    if (!this.hasValidToken()) {
      this.completeLogout();
      return;
    }

    this.syncSessionState();

    const storedUser = this.getStoredCurrentUser();
    if (storedUser) {
      this.setCurrentUserState(storedUser, false);
    }

    await firstValueFrom(this.loadCurrentUser().pipe(map(() => void 0)));
  }

  login(username: string, password: string, recaptchaResponse: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/signin`, {
      username,
      password,
      recaptchaResponse
    }).pipe(
      tap((response) => {
        this.setCurrentUserState(this.normalizeCurrentUser(response.user));
        this.setSession(response.token);
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

  getCurrentUser(): Observable<LoggedInUser | null> {
    return this.currentUser$;
  }

  getCurrentUserSnapshot(): LoggedInUser | null {
    return this.currentUserSubject.value;
  }

  loadCurrentUser(forceRefresh = false): Observable<LoggedInUser | null> {
    if (!this.isBrowser || !this.hasValidToken()) {
      this.completeLogout();
      return of(null);
    }

    if (!forceRefresh && this.currentUserRequest$) {
      return this.currentUserRequest$;
    }

    this.currentUserRequest$ = this.http.get<LoggedInUser>(`${environment.apiUrl}/api/auth/me`, {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true)
    }).pipe(
      map((user) => this.normalizeCurrentUser(user)),
      tap((user) => this.setCurrentUserState(user)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.completeLogout();
          return of(null);
        }

        console.error('Failed to load current user details', error);
        return of(this.currentUserSubject.value);
      }),
      finalize(() => {
        this.currentUserRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.currentUserRequest$;
  }

  setUser(user: User | LoggedInUser): void {
    this.setCurrentUserState(this.normalizeCurrentUser(user));
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
    this.currentUserRequest$ = null;
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

  private setCurrentUserState(user: LoggedInUser | null, persist = true): void {
    this.currentUserSubject.next(user);

    if (user?.roles?.length) {
      this.rolesSubject.next([...user.roles]);
    }

    if (!this.isBrowser || !persist) {
      return;
    }

    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }

  private getStoredCurrentUser(): LoggedInUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const storedUser = sessionStorage.getItem('currentUser');
    if (!storedUser) {
      return null;
    }

    try {
      return this.normalizeCurrentUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Failed to parse stored current user', error);
      sessionStorage.removeItem('currentUser');
      return null;
    }
  }

  private normalizeCurrentUser(user: Partial<LoggedInUser> | User | null | undefined): LoggedInUser | null {
    if (!user) {
      return null;
    }

    const roles = Array.isArray(user.roles)
      ? [...new Set(user.roles.filter((role): role is string => typeof role === 'string' && role.trim().length > 0))]
      : [];
    const fullName = ('fullName' in user && user.fullName !== undefined ? user.fullName : user.userProfile?.fullName) ?? null;
    const activeRole = ('activeRole' in user && user.activeRole !== undefined ? user.activeRole : null)
      ?? this.resolveActiveRole(roles);

    return {
      ...user,
      username: user.username ?? '',
      email: user.email ?? '',
      roles,
      fullName,
      activeRole
    } as LoggedInUser;
  }

  private resolveActiveRole(roles: string[]): string | null {
    if (!roles.length) {
      return null;
    }

    const prioritizedRole = this.activeRolePriority.find((role) => roles.includes(role));
    return prioritizedRole ?? roles[0];
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }
}
