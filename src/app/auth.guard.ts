import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './services/login.service';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router,private authService:AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    const roles = localStorage.getItem("roles");
    const expectedRole = route.data['expectedRole']; // Access expectedRole dynamically using index signature


    if (!this.authService.isAuthenticated()) {
      debugger
      this.router.navigate(['/']);
      return false;
    }

    if (!roles || !roles.includes(expectedRole)) {
      debugger
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}