import { Component, OnInit } from '@angular/core';
import { SideMenuItem } from '../../../interface/side-menu-item';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  menuItems: SideMenuItem[] = [];
 progfileIcon= 'assets/images/profile.png';

  allMenuItems = [
    { label: 'Dashboard', routerLink: 'detailsPage', icon: 'assets/images/icon/dashboard.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'Duplicate Record', routerLink: 'dup-brn-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'Concern Record', routerLink: 'con-reg-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'Upload CSV', routerLink: 'csv-upload', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    { label: 'change-password', routerLink: 'change-password', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    { label: 'profile', routerLink: 'profile', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
    
  ];
  userRoles: string[] = [];
  constructor(private authService: AuthService,private router: Router) { }

  logout(): void {
    this.authService.logout();
    
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    
    this.menuItems = this.allMenuItems.filter(item =>
      item.roles.some(role => this.userRoles.includes(role))
    );

  }
}
