import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css',
    standalone: false
})

export class NavComponent {
  isLoggedIn$!: Observable<boolean>;
  isLoggedIn:boolean = true;
  navLinks: {
  label: string;  // this will be translation key
  url: string | null;
  routerLink: string | null;
  class: string;
  roles: string[];
}[] = [
  { label: "HOME", url: "/", routerLink: "/", class: "", roles: ['ROLE_USER'] },
  { label: "ABOUT_US", url: null, routerLink: "/aboutus", class: "", roles: ['ROLE_USER'] },
  { label: "SEARCH_BRN", url: null, routerLink: "/search-brn", class: "", roles: ['ROLE_USER'] },
  { label: "DASHBOARD", url: null, routerLink: "/dashboard", class: "", roles: ['ROLE_USER'] },
  { label: "FAQ", url: null, routerLink: "/faq", class: "", roles: ['ROLE_USER'] },
  { label: "CIRCULAR", url: null, routerLink: "/circular", class: "", roles: ['ROLE_USER'] },
  { label: "Contact_Us", url: null, routerLink: "/contactus", class: "", roles: ['ROLE_USER'] },
  { label: "REGISTRY", url: null, routerLink: "/des-registry", class: "", roles: ['ROLE_ADMIN','ROLE_DES_STATE','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
  { label: "REGION", url: null, routerLink: "/des-region", class: "", roles: ['ROLE_DES_REGION'] },
  { label: "DISTRICT_DETAILS", url: null, routerLink: "/des-district-brn-details", class: "", roles: ['ROLE_DES_DISTRICT'] },
  { label: "CHANGE_PASSWORD", url: null, routerLink: "/changePassword", class: "", roles: ['ROLE_ADMIN','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
  
];

 //'ROLE_ADMIN','ROLE_USER' ,'ROLE_MODERATOR' 
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

    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      
      if (isLoggedIn) {
        this.authService.getUserRolesObservable().subscribe(userRoles => {
          this.filterNavLinks(userRoles, true);
        });
      } else {
        // user not logged in → only show public menu (ROLE_USER without logout)
        this.filterNavLinks(['ROLE_USER'], false);
      }
    });
}

filterNavLinks(userRoles: string[], includeLogout: boolean): void {
    this.filteredNavLinks = this.navLinks.filter(link =>
      // logout only if logged in
      (link.label === "Logout" ? includeLogout : true) &&
      // if no role restriction → show
      (link.roles.length === 0 || link.roles.some(r => userRoles.includes(r)))
    );
  }

logout(){
    
    this.authService.logout();
}

}