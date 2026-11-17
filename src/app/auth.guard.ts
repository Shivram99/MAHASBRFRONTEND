import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRoles = (route.data['expectedRole'] as string[] | undefined) ?? [];

    if (!this.authService.isAuthenticated()) {
      return this.router.parseUrl('/login');
    }

    this.authService.validateSessionInBackground();

    // Still on a temporary password: the change-password page is the only page allowed.
    // The backend enforces the same rule, so this is about user experience, not security.
    if (this.authService.requiresPasswordChange()) {
      const changePasswordRoute = this.authService.changePasswordRoute;
      const isChangePasswordPage = state.url.split('?')[0] === changePasswordRoute;
      return isChangePasswordPage ? true : this.router.parseUrl(changePasswordRoute);
    }

    if (expectedRoles.length === 0) {
      return true;
    }

    const userRoles = this.authService.getUserRoles();
    const hasMatchingRole = expectedRoles.some((expectedRole) => userRoles.includes(expectedRole));

    return hasMatchingRole ? true : this.router.parseUrl('/unauthorized');
  }
}
