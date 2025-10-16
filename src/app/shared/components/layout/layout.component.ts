import { Component, OnInit } from '@angular/core';
import { SideMenuItem } from '../../../interface/side-menu-item';
import { AuthService } from '../../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../../../interface/user';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  menuItems: SideMenuItem[] = [];
  user: User | null = null;
 progfileIcon= 'assets/images/profile.png';
activeLabel: string = 'Dashboard';
  allMenuItems = [
    { label: 'MENU.DASHBOARD', routerLink: 'detailsPage', icon: 'assets/images/icon/dashboard.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'MENU.DUPLICATE_RECORD', routerLink: 'dup-brn-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_REG_AUTH_API'] },
    { label: 'MENU.CONCERN_RECORD', routerLink: 'con-reg-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_REG_AUTH_API'] },
    { label: 'MENU.UPLOAD_CSV', routerLink: 'csv-upload', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    // { label: 'change-password', routerLink: 'change-password', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'MENU.PROFILE', routerLink: 'profile', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_ADMIN'] },
    { label: 'MENU.USER', routerLink: 'user', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },
    { label: 'registery', routerLink: 'registery', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },
    { label: 'Circular', routerLink: 'add-circular', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },

    
    
  ];
  userRoles: string[] = [];
  constructor(private authService: AuthService,private router: Router) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const activeItem = this.menuItems.find(item => this.router.url.includes(item.routerLink));
      this.activeLabel = activeItem ? activeItem.label : 'Dashboard';
    });
  }
  logout(): void {
    this.authService.logout();
    
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    
    this.menuItems = this.allMenuItems.filter(item =>
      item.roles.some(role => this.userRoles.includes(role))
    );
  this.authService.currentUser$.subscribe(user => this.user = user);
  }
}
