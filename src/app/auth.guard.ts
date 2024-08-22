import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './services/login.service';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof localStorage !== 'undefined') {
    const isAuthenticated: string | null = localStorage.getItem("isAuthenticated");
    const storedRoles: string | null = localStorage.getItem("roles");
    const expectedRoles: string[] = route.data['expectedRole'];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }

    if (!storedRoles) {
      // Handle case where roles are not available
      this.router.navigate(['/unauthorized']);
      return false;
    }

    const userRoles: string[] = storedRoles.split(',');
    debugger
    // Check if any of the user roles match the expected roles
    const hasMatchingRole = expectedRoles.some(expectedRole => userRoles.includes(expectedRole));

    if (!hasMatchingRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  
  }else{
    this.router.navigate(['/unauthorized']);
      return false;
  }
    
    
  }
  
}