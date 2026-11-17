import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { NavComponent } from './nav.component';

@Pipe({ name: 'translate', standalone: false })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let isLoggedInSubject: BehaviorSubject<boolean>;
  let rolesSubject: BehaviorSubject<string[]>;
  let routerEventsSubject: Subject<NavigationEnd>;

  const authServiceMock = {
    getIsLoggedIn: () => isLoggedInSubject.asObservable(),
    getUserRolesObservable: () => rolesSubject.asObservable(),
    getResolvedHomeRoute: (roles: string[]) => resolveHomeRoute(roles),
    logout: jasmine.createSpy('logout')
  };

  const routerMock = {
    url: '/',
    events: new Subject<NavigationEnd>().asObservable()
  };

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    rolesSubject = new BehaviorSubject<string[]>([]);
    routerEventsSubject = new Subject<NavigationEnd>();
    routerMock.url = '/';
    routerMock.events = routerEventsSubject.asObservable();
    authServiceMock.logout.calls.reset();

    await TestBed.configureTestingModule({
      declarations: [NavComponent, TranslatePipeStub],
      imports: [CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows only public menu links when the user is not logged in', () => {
    setAuthState(false, []);

    expect(getLabels()).toEqual([
      'HOME',
      'ABOUT_US',
      'SEARCH_BRN',
      'DASHBOARD',
      'FAQ',
      'CIRCULAR',
      'Contact_Us',
      'ReqForm.title'
    ]);
    expect(getRouterLink('HOME')).toBe('/');
    expect(getLabels()).not.toContain('MENU.DASHBOARD');
    expect(getLabels()).not.toContain('CHANGE_PASSWORD');
  });

  it('shows only private menu links and resolves Home for registry users', () => {
    setAuthState(true, ['ROLE_REG_AUTH_CSV']);

    expect(getLabels()).toEqual(['HOME', 'MENU.DASHBOARD', 'CHANGE_PASSWORD']);
    expect(getRouterLink('HOME')).toBe('/common-post-login/detailsPage');
    expect(getRouterLink('MENU.DASHBOARD')).toBe('/common-post-login/detailsPage');
    expect(getLabels()).not.toContain('ABOUT_US');
    expect(getLabels()).not.toContain('SEARCH_BRN');
  });

  it('hides the common dashboard link for admins and points Home to profile', () => {
    setAuthState(true, ['ROLE_ADMIN']);

    expect(getLabels()).toEqual(['HOME', 'CHANGE_PASSWORD']);
    expect(getRouterLink('HOME')).toBe('/common-post-login/profile');
    expect(getLabels()).not.toContain('MENU.DASHBOARD');
    expect(getLabels()).not.toContain('ABOUT_US');
  });

  it('points Home to the developer dashboard without showing public links', () => {
    setAuthState(true, ['ROLE_DEVELOPER']);

    expect(getLabels()).toEqual(['HOME']);
    expect(getRouterLink('HOME')).toBe('/developer/developerDashboard');
    expect(getLabels()).not.toContain('DASHBOARD');
    expect(getLabels()).not.toContain('ABOUT_US');
  });

  it('updates the active link when the route changes', () => {
    setAuthState(false, []);
    routerEventsSubject.next(new NavigationEnd(1, '/faq', '/faq'));
    fixture.detectChanges();

    expect(component.isActiveLink('/faq')).toBeTrue();
    expect(component.isActiveLink('/aboutus')).toBeFalse();
  });

  function setAuthState(isLoggedIn: boolean, roles: string[]): void {
    isLoggedInSubject.next(isLoggedIn);
    rolesSubject.next(roles);
    fixture.detectChanges();
  }

  function getLabels(): string[] {
    return component.filteredNavLinks.map((link) => link.label);
  }

  function getRouterLink(label: string): string | null {
    return component.filteredNavLinks.find((link) => link.label === label)?.routerLink ?? null;
  }

  function resolveHomeRoute(roles: string[]): string | null {
    const roleHomeRoutes = [
      { role: 'ROLE_DEVELOPER', route: '/developer/developerDashboard' },
      { role: 'ROLE_MODERATOR', route: '/admin/dashboardadmin' },
      { role: 'ROLE_DES_STATE', route: '/common-post-login/detailsPage' },
      { role: 'ROLE_DES_REGION', route: '/common-post-login/detailsPage' },
      { role: 'ROLE_DES_DISTRICT', route: '/common-post-login/detailsPage' },
      { role: 'ROLE_REG_AUTH_API', route: '/common-post-login/detailsPage' },
      { role: 'ROLE_REG_AUTH_CSV', route: '/common-post-login/detailsPage' },
      { role: 'ROLE_USER', route: '/dashboard' }
    ];

    const matchedRoute = roleHomeRoutes.find(({ role }) => roles.includes(role));
    if (matchedRoute) {
      return matchedRoute.route;
    }

    const commonPostLoginRoles = [
      'ROLE_ADMIN',
      'ROLE_DES_STATE',
      'ROLE_DES_REGION',
      'ROLE_DES_DISTRICT',
      'ROLE_REG_AUTH_API',
      'ROLE_REG_AUTH_CSV'
    ];

    return roles.some((role) => commonPostLoginRoles.includes(role))
      ? '/common-post-login/profile'
      : null;
  }
});
