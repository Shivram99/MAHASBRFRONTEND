import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse } from '../interface/AuthResponse';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private helper = new JwtHelperService();
  private readonly commonPostLoginProfileRoute = '/common-post-login/profile';
  private readonly roleHomeRoutes: Array<{ role: string; route: string }> = [
    { role: 'ROLE_DEVELOPER', route: '/developer/developerDashboard' },
    { role: 'ROLE_MODERATOR', route: '/admin/dashboardadmin' },
    // { role: 'ROLE_ADMIN', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_DES_STATE', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_DES_REGION', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_DES_DISTRICT', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_REG_AUTH_API', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_REG_AUTH_CSV', route: '/common-post-login/detailsPage' },
    { role: 'ROLE_USER', route: '/dashboard' }
  ];

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private rolesSubject = new BehaviorSubject<string[]>([]);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
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

  // 🔹 Login
  login(username: string, password: string, recaptchaResponse: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/signin`, {
      username,
      password,
      recaptchaResponse
    }).pipe(
      tap(response => {
        // Store JWT token securely
        console.log('Response (pretty):', JSON.stringify(response, null, 2));
        this.currentUserSubject.next(response.user);
        this.setSession(response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
      }),
      catchError(this.handleError)
    );
  }

  // logout(): void {
  //   if (!this.isBrowser) return;

  //   // Remove token from storage
  // fallback if signOut not implemented


  //   // Reset state
  //   this.clearSession();
  //   this.rolesSubject.next(['ROLE_USER']);
  //    this.currentUserSubject.next(null);
  //   // Navigate to login page
  //   this.router.navigate(['/login']);
  // }

  logout(): void {
    this.http.post<{ message?: string }>(`${environment.apiUrl}/api/auth/logout`, {})
      .subscribe({
        next: (res) => {
          console.log(res?.message ?? 'Logged out successfully'); // ✅ safe null check
          this.clearSession();
        },
        error: (err) => {
          console.error('Backend logout failed:', err);
        },
        complete: () => {
          // Always clear frontend state regardless of backend response

          // Clear JWT & session info
          this.clearSession();

          // Reset BehaviorSubjects
          this.currentUserSubject.next(null);
          this.rolesSubject.next(['ROLE_USER']); // ✅ use [] instead of fake ROLE_USER
          this.tokenStorage.removeToken();
          // Remove stored user
          sessionStorage.removeItem('currentUser');

          // Redirect to login
          this.router.navigate(['/login']);
        }
      });
  }



  private setSession(token: string | undefined): void {
    if (!this.isBrowser) return;

    if (!token || token.trim() === '') {
      console.error('No JWT provided to setSession!');
      this.clearSession();
      return;
    }

    this.tokenStorage.saveToken(token);
    this.isLoggedInSubject.next(true);
    this.rolesSubject.next(this.getRolesFromToken());
  }

  private clearSession(): void {
    if (!this.isBrowser) return;
    // if you have a signOut() in TokenStorageService

    this.isLoggedInSubject.next(false);
    this.rolesSubject.next([]); // clear roles
  }



  getToken(): string | null {
    return this.isBrowser ? this.tokenStorage.getToken() : null;
  }

  isAuthenticated(): boolean {
    return this.isBrowser && this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();

    // Check if token exists and looks like a JWT (3 parts separated by ".")
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

    // Check if token exists and looks like a JWT (must have 3 parts)
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return [];
    }

    try {
      const decoded: any = this.helper.decodeToken(token);
      return decoded?.roles ?? [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }


  // 🔹 Observables
  getIsLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  getUserRolesObservable() {
    return this.rolesSubject.asObservable();
  }

  getUserRoles(): string[] {
    return this.rolesSubject.value;
  }

  getDefaultHomeRoute(roles: string[] = this.getUserRoles()): string | null {
    const matchedRoute = this.roleHomeRoutes.find(({ role }) => roles.includes(role));
    return matchedRoute?.route ?? null;
  }

  // 🔹 Error Handling
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

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error:', error);
    return throwError(() => error);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // call this after login success
  setUser(user: User) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
