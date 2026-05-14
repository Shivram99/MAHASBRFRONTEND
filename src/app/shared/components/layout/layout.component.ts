import { Component, OnInit } from '@angular/core';
import { SideMenuItem } from '../../../interface/side-menu-item';
import { AuthService } from '../../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../../../interface/user';
import { filter } from 'rxjs';
import { MenuService } from '../../../services/menu.service';
import { MenuDTO } from '../../../interface/menu-dto';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  menuItems: SideMenuItem[] = [];
  user: User | null = null;
 progfileIcon= 'assets/images/profile.png';
activeLabel: string = 'Dashboard';
  currentUrl = '';
  // allMenuItems = [
  //   { label: 'MENU.DASHBOARD', routerLink: 'detailsPage', icon: 'assets/images/icon/dashboard.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
  //   { label: 'MENU.DUPLICATE_RECORD', routerLink: 'dup-brn-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_REG_AUTH_API'] },
  //   { label: 'MENU.CONCERN_RECORD', routerLink: 'con-reg-details', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_REG_AUTH_API'] },
  //   { label: 'MENU.UPLOAD_CSV', routerLink: 'csv-upload', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV'] },
  //   // { label: 'change-password', routerLink: 'change-password', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API'] },
  //   { label: 'MENU.PROFILE', routerLink: 'profile', icon: 'assets/images/icon/region.png', roles: ['ROLE_REG_AUTH_CSV','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_ADMIN'] },
  //   { label: 'MENU.USER', routerLink: 'user', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },
  //   { label: 'registery', routerLink: 'registery', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },
  //   { label: 'CIRCULAR', routerLink: 'add-circular', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },
  //   { label: 'Request Form', routerLink: 'request-form-list', icon: 'assets/images/icon/region.png', roles: ['ROLE_ADMIN'] },  
  // ];
  userRoles: string[] = [];

  menus: MenuDTO[] = [];


  constructor(private authService: AuthService,private router: Router,public menuService: MenuService) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentUrl = this.normalizeRoute((event as NavigationEnd).urlAfterRedirects);
      this.syncActiveMenuState();
    });
     this.menuService.loadMyMenus();
    this.menuService.menus$.subscribe(m => {
      this.menus = m;
      this.syncActiveMenuState();
    });
  }
  logout(): void {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.currentUrl = this.normalizeRoute(this.router.url);
    // this.menuItems = this.allMenuItems.filter(item =>
    //   item.roles.some(role => this.userRoles.includes(role))
    // );
  this.authService.currentUser$.subscribe(user => this.user = user);
  }
activeParent: MenuDTO | null = null;
activeChild: MenuDTO | null = null;

toggleMenu(menu: MenuDTO) {
  // Clicking again collapses
  if (this.activeParent?.id === menu.id) {
    this.activeParent = null;
    this.activeChild = null;
    return;
  }

  // If parent has no children → navigate directly
  if (!menu.children || menu.children.length === 0) {
    this.router.navigate([menu.route]);
    return;
  }

  // Expand parent
  this.activeParent = menu;
  this.activeChild = null;
}

toggleChild(child: MenuDTO) {
  if (!child.children || child.children.length === 0) {
    this.router.navigate([child.route]);
    return;
  }

  // Expand/collapse child
  if (this.activeChild?.id === child.id) {
    this.activeChild = null;
  } else {
    this.activeChild = child;
  }
}

isMenuActive(menu: MenuDTO): boolean {
  if (this.matchesRoute(menu.route)) {
    return true;
  }

  return (menu.children ?? []).some((child) => this.isMenuActive(child));
}

private syncActiveMenuState(): void {
  const activeTrail = this.findActiveTrail(this.menus);

  this.activeParent = activeTrail.parent;
  this.activeChild = activeTrail.child;
  this.activeLabel = activeTrail.label ?? 'Dashboard';
}

private findActiveTrail(menus: MenuDTO[]): { parent: MenuDTO | null; child: MenuDTO | null; label: string | null } {
  for (const menu of menus) {
    if (this.matchesRoute(menu.route)) {
      return {
        parent: menu.children?.length ? menu : null,
        child: null,
        label: menu.nameEn
      };
    }

    for (const child of menu.children ?? []) {
      if (this.matchesRoute(child.route)) {
        return {
          parent: menu,
          child: child.children?.length ? child : null,
          label: child.nameEn
        };
      }

      for (const subChild of child.children ?? []) {
        if (this.matchesRoute(subChild.route)) {
          return {
            parent: menu,
            child,
            label: subChild.nameEn
          };
        }
      }
    }
  }

  return { parent: null, child: null, label: null };
}

private matchesRoute(route: string | undefined | null): boolean {
  if (!route) {
    return false;
  }

  const normalizedRoute = this.normalizeRoute(route);

  if (!normalizedRoute || normalizedRoute === '/') {
    return this.currentUrl === '/';
  }

  return this.currentUrl === normalizedRoute || this.currentUrl.endsWith(normalizedRoute) || this.currentUrl.startsWith(`${normalizedRoute}/`);
}

private normalizeRoute(route: string): string {
  const [pathWithoutQuery] = route.split(/[?#]/);
  const normalizedPath = (pathWithoutQuery || '').trim();

  if (!normalizedPath) {
    return '/';
  }

  const withoutLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return withoutLeadingSlash.length > 1 && withoutLeadingSlash.endsWith('/')
    ? withoutLeadingSlash.slice(0, -1)
    : withoutLeadingSlash;
}

}
