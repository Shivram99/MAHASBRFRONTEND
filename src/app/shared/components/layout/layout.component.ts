import { Component, OnInit } from '@angular/core';
import { SideMenuItem } from '../../../interface/side-menu-item';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  menuItems: SideMenuItem[] = [];

  allMenuItems = [
    { label: 'Dashboard', routerLink: 'detailsPage', icon: 'assets/images/icon/dashboard.png', roles: ['ROLE_USER', 'ROLE_REG_AUTH_CSV'] },
    { label: 'Duplicate Record', routerLink: 'dup-brn-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    { label: 'Concern Record', routerLink: 'con-reg-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    { label: 'Upload CSV', routerLink: 'csv-upload', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    { label: 'change-password', routerLink: 'change-password', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    { label: 'profile', routerLink: 'profile', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
    
  ];
  userRoles: string[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    debugger
    this.menuItems = this.allMenuItems.filter(item =>
      item.roles.some(role => this.userRoles.includes(role))
    );

  }
}
