import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent {
  isLoggedIn:boolean = false;
  navLinks: {
    label: string;
    url: string | null;
    routerLink: string | null;
    class: string;
    roles: string[];
  }[] = [
    { label: "Home", url: "/", routerLink: null, class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "About Us", url: null, routerLink: "/aboutus", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "Search BRN", url: null, routerLink: "/search-brn", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "Dashboard", url: null, routerLink: "/dashboard", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "FAQ", url: null, routerLink: "/faq", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "Circular", url: null, routerLink: "/circular", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DEVELOPER','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] },
    { label: "citizen-dashboard", url: null, routerLink: "/citizen-dashboard", class: "", roles: ['ROLE_USER','ROLE_ADMIN','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT','ROLE_REG_AUTH_API','ROLE_REG_AUTH_CSV'] }
    
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
    
    this.authService.getUserRolesObservable().subscribe(() => {
      this.filterLinks();
    });
  
}
filterLinks() {
  const userRoles = this.authService.getUserRoles();
  this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
    this.isLoggedIn = isLoggedIn;
    if(!this.isLoggedIn){
      userRoles.push('ROLE_USER')
    }
  });

  
  this.filteredNavLinks = this.navLinks.filter(link =>
    link.roles.length === 0 || link.roles.some(role => userRoles.includes(role))
  );
}
logout() :void{

  this.authService.logout();
  this.router.navigate(['/']);

}

}