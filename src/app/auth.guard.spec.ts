import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('authGuard', () => {
  let guard: authGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
      'validateSessionInBackground',
      'getUserRoles'
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['parseUrl']);
    router.parseUrl.and.callFake((url: string) => ({ url }) as unknown as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(authGuard);
  });

  it('redirects unauthenticated users to login', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate(createRoute(['ROLE_ADMIN']), createState('/admin'));

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toEqual({ url: '/login' } as unknown as UrlTree);
  });

  it('allows users with a matching role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRoles.and.returnValue(['ROLE_ADMIN']);

    const result = guard.canActivate(createRoute(['ROLE_ADMIN']), createState('/admin'));

    expect(result).toBeTrue();
    expect(authService.validateSessionInBackground).toHaveBeenCalled();
  });

  it('redirects authenticated users without a matching role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRoles.and.returnValue(['ROLE_USER']);

    const result = guard.canActivate(createRoute(['ROLE_ADMIN']), createState('/admin'));

    expect(router.parseUrl).toHaveBeenCalledWith('/unauthorized');
    expect(result).toEqual({ url: '/unauthorized' } as unknown as UrlTree);
  });

  function createRoute(expectedRole: string[]): ActivatedRouteSnapshot {
    return { data: { expectedRole } } as unknown as ActivatedRouteSnapshot;
  }

  function createState(url: string): RouterStateSnapshot {
    return { url } as unknown as RouterStateSnapshot;
  }
});
