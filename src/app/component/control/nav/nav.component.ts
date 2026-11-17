import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

interface NavLink {
  label: string;
  url: string | null;
  routerLink: string | null;
  class: string;
  roles: string[];
  publicOnly?: boolean;
  authOnly?: boolean;
  useResolvedHomeRoute?: boolean;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  standalone: false
})
export class NavComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  currentUrl = '/';
  private currentUserRoles: string[] = ['ROLE_USER'];
  private currentIsAuthenticated = false;

  navLinks: NavLink[] = [
      { label: 'HOME', url: null, routerLink: '/', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'ABOUT_US', url: null, routerLink: '/aboutus', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'SEARCH_BRN', url: null, routerLink: '/search-brn', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'DASHBOARD', url: null, routerLink: '/dashboard', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'FAQ', url: null, routerLink: '/faq', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'CIRCULAR', url: null, routerLink: '/circular', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'Contact_Us', url: null, routerLink: '/contactus', class: '', roles: ['ROLE_USER'], publicOnly: true },
      { label: 'ReqForm.title', url: null, routerLink: '/requestForm', class: '', roles: ['ROLE_USER'], publicOnly: true },
      /* {
        label: 'HOME',
        url: null,
        routerLink: null,
        class: '',
        roles: [],
        authOnly: true,
        useResolvedHomeRoute: true
      }, */
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

  filteredNavLinks: NavLink[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.getIsLoggedIn();
    this.currentUrl = this.normalizeUrl(this.router.url);

    combineLatest([
      this.isLoggedIn$,
      this.authService.getUserRolesObservable()
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isLoggedIn, userRoles]) => {
      this.currentIsAuthenticated = isLoggedIn;
      this.currentUserRoles = isLoggedIn ? userRoles : ['ROLE_USER'];
      this.filterNavLinks(this.currentUserRoles, this.currentIsAuthenticated);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.currentUrl = this.normalizeUrl((event as NavigationEnd).urlAfterRedirects);
        this.filterNavLinks(this.currentUserRoles, this.currentIsAuthenticated);
      });
  }

  filterNavLinks(userRoles: string[], isAuthenticated: boolean): void {
    const resolvedHomeRoute = isAuthenticated ? this.authService.getResolvedHomeRoute(userRoles) : null;

    this.filteredNavLinks = this.navLinks.reduce<NavLink[]>((links, link) => {
      if (!this.shouldShowLink(link, userRoles, isAuthenticated)) {
        return links;
      }

      if (link.useResolvedHomeRoute) {
        if (resolvedHomeRoute) {
          links.push({ ...link, routerLink: resolvedHomeRoute, url: null });
        }

        return links;
      }

      links.push(link);
      return links;
    }, []);
  }

  private shouldShowLink(
    link: NavLink,
    userRoles: string[],
    isAuthenticated: boolean
  ): boolean {
    if (link.publicOnly) {
      return !isAuthenticated;
    }

    if (link.authOnly) {
      if (!isAuthenticated) {
        return false;
      }

      const roleAllowed = this.hasRequiredRole(link, userRoles);

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

    return this.hasRequiredRole(link, userRoles);
  }

  private hasRequiredRole(link: NavLink, userRoles: string[]): boolean {
    return link.roles.length === 0 || link.roles.some((role) => userRoles.includes(role));
  }

  logout() {
    this.authService.logout();
  }

  isActiveLink(routerLink: string | null): boolean {
    if (!routerLink) {
      return false;
    }

    const normalizedLink = this.normalizeUrl(routerLink);

    if (normalizedLink === '/') {
      return this.currentUrl === '/';
    }

    return this.currentUrl === normalizedLink || this.currentUrl.startsWith(`${normalizedLink}/`);
  }

  private normalizeUrl(url: string): string {
    const [pathWithoutQuery] = url.split(/[?#]/);
    const normalizedPath = pathWithoutQuery || '/';

    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
      return normalizedPath.slice(0, -1);
    }

    return normalizedPath;
  }
}
