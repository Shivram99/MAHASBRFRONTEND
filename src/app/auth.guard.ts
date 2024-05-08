import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const roles = localStorage.getItem("roles");
    const expectedRole = route.data['expectedRole']; // Access expectedRole dynamically using index signature

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!roles || !roles.includes(expectedRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}