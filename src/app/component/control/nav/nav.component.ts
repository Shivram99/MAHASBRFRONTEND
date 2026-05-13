import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  standalone: false
})
export class NavComponent {
  isLoggedIn$!: Observable<boolean>;
  isLoggedIn = true;

  navLinks: {
    label: string;
    url: string | null;
    routerLink: string | null;
    class: string;
    roles: string[];
  }[] = [
    { label: 'HOME', url: '/', routerLink: '/', class: '', roles: ['ROLE_USER'] },
    { label: 'ABOUT_US', url: null, routerLink: '/aboutus', class: '', roles: ['ROLE_USER'] },
    { label: 'SEARCH_BRN', url: null, routerLink: '/search-brn', class: '', roles: ['ROLE_USER'] },
    { label: 'DASHBOARD', url: null, routerLink: '/dashboard', class: '', roles: ['ROLE_USER'] },
    { label: 'FAQ', url: null, routerLink: '/faq', class: '', roles: ['ROLE_USER'] },
    { label: 'CIRCULAR', url: null, routerLink: '/circular', class: '', roles: ['ROLE_USER'] },
    { label: 'Contact_Us', url: null, routerLink: '/contactus', class: '', roles: ['ROLE_USER'] },
    { label: 'ReqForm.title', url: null, routerLink: '/requestForm', class: '', roles: ['ROLE_USER'] },
    {
      label: 'MENU.DASHBOARD',
      url: null,
      routerLink: '/common-post-login/detailsPage',
      class: '',
      roles: ['ROLE_ADMIN', 'ROLE_DES_STATE', 'ROLE_REG_AUTH_API', 'ROLE_REG_AUTH_CSV', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT']
    },
    {
      label: 'CHANGE_PASSWORD',
      url: null,
      routerLink: '/common-post-login/changePassword',
      class: '',
      roles: ['ROLE_ADMIN', 'ROLE_DES_STATE', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT', 'ROLE_REG_AUTH_API', 'ROLE_REG_AUTH_CSV']
    }
  ];

  filteredNavLinks: {
    label: string;
    url: string | null;
    routerLink: string | null;
    class: string;
    roles: string[];
  }[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.getIsLoggedIn();

    this.authService.getIsLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.authService.getUserRolesObservable().subscribe((userRoles) => {
          this.filterNavLinks(userRoles, true);
        });
      } else {
        this.filterNavLinks(['ROLE_USER'], false);
      }
    });
  }

  filterNavLinks(userRoles: string[], includeLogout: boolean): void {
    const defaultHomeRoute = includeLogout ? this.authService.getResolvedHomeRoute(userRoles) : null;

    this.filteredNavLinks = this.navLinks
      .filter((link) =>
        (link.label === 'Logout' ? includeLogout : true)
        && (link.roles.length === 0 || link.roles.some((role) => userRoles.includes(role)))
      )
      .map((link) => link.label === 'HOME' && defaultHomeRoute
        ? { ...link, routerLink: defaultHomeRoute, url: null }
        : link
      );
  }

  logout() {
    this.authService.logout();
  }
}
