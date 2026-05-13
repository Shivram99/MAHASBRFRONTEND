import { Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
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
    publicOnly?: boolean;
    authOnly?: boolean;
  }[] = [
      { label: 'HOME', url: null, routerLink: '/', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'ABOUT_US', url: null, routerLink: '/aboutus', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'SEARCH_BRN', url: null, routerLink: '/search-brn', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'DASHBOARD', url: null, routerLink: '/dashboard', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'FAQ', url: null, routerLink: '/faq', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'CIRCULAR', url: null, routerLink: '/circular', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'Contact_Us', url: null, routerLink: '/contactus', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'ReqForm.title', url: null, routerLink: '/requestForm', class: '', roles: ['ROLE_USER'], publicOnly: true },
      {
        label: 'MENU.DASHBOARD',
        url: null,
        routerLink: '/common-post-login/detailsPage',
        class: '',
        roles: ['ROLE_DES_STATE', 'ROLE_REG_AUTH_API', 'ROLE_REG_AUTH_CSV', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT'],
        authOnly: true
      },
      {
        label: 'CHANGE_PASSWORD',
        url: null,
        routerLink: '/common-post-login/changePassword',
        class: '',
        roles: ['ROLE_ADMIN', 'ROLE_DES_STATE', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT', 'ROLE_REG_AUTH_API', 'ROLE_REG_AUTH_CSV'],
        authOnly: true
      }
    ];

  filteredNavLinks: {
    label: string;
    url: string | null;
    routerLink: string | null;
    class: string;
    roles: string[];
    publicOnly?: boolean;
    authOnly?: boolean;
  }[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.getIsLoggedIn();

    combineLatest([
      this.authService.getIsLoggedIn(),
      this.authService.getUserRolesObservable()
    ]).subscribe(([isLoggedIn, userRoles]) => {
      this.filterNavLinks(
        isLoggedIn ? userRoles : ['ROLE_USER'],
        isLoggedIn
      );
    });
  }

  filterNavLinks(userRoles: string[], isAuthenticated: boolean): void {
    const defaultHomeRoute = isAuthenticated ? this.authService.getResolvedHomeRoute(userRoles) : null;

    this.filteredNavLinks = this.navLinks
      .filter((link) =>
        this.shouldShowLink(link, userRoles, isAuthenticated)
      )
      .map((link) => link.label === 'HOME' && defaultHomeRoute
        ? { ...link, routerLink: defaultHomeRoute, url: null }
        : link
      );
  }

  private shouldShowLink(
    link: { label: string; roles: string[]; routerLink: string | null; publicOnly?: boolean; authOnly?: boolean },
    userRoles: string[],
    isAuthenticated: boolean
  ): boolean {
    if (link.publicOnly && isAuthenticated) {
      return false;
    }

    if (link.authOnly && !isAuthenticated) {
      return false;
    }

    const roleAllowed = link.roles.length === 0 || link.roles.some((role) => userRoles.includes(role));

    if (!roleAllowed) {
      return false;
    }

    // Admin users should not see the common post-login dashboard entry
    // in the horizontal menu when that dashboard is not part of their flow.
    if (link.label === 'MENU.DASHBOARD' && userRoles.includes('ROLE_ADMIN')) {
      return false;
    }

    return true;
  }

  logout() {
    this.authService.logout();
  }
}
