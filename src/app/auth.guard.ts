import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles = (route.data['expectedRole'] as string[] | undefined) ?? [];

    if (!this.authService.isAuthenticated()) {
      return of(this.router.parseUrl('/login'));
    }

    return this.authService.validateSession().pipe(
      map((sessionState) => {
        if (sessionState === 'invalid') {
          return this.router.parseUrl('/login');
        }

        if (sessionState === 'unavailable') {
          return this.router.parseUrl('/');
        }

        if (expectedRoles.length === 0) {
          return true;
        }

        const userRoles = this.authService.getUserRoles();
        const hasMatchingRole = expectedRoles.some((expectedRole) => userRoles.includes(expectedRole));

        return hasMatchingRole ? true : this.router.parseUrl('/unauthorized');
      })
    );
  }
}
