import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicRouteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    const resolvedHomeRoute = this.authService.getResolvedHomeRoute();
    const requestedUrl = this.normalizeUrl(state.url);

    if (resolvedHomeRoute && requestedUrl === this.normalizeUrl(resolvedHomeRoute)) {
      return true;
    }

    return this.router.parseUrl(resolvedHomeRoute ?? '/unauthorized');
  }

  private normalizeUrl(url: string): string {
    const [pathWithoutQuery] = url.split(/[?#]/);
    return pathWithoutQuery === '' ? '/' : pathWithoutQuery;
  }
}
