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
    { label: "Home", url: "/", routerLink: null, class: "", roles: [] },
    { label: "About Us", url: null, routerLink: "/aboutus", class: "", roles: [] },
    { label: "Search BRN", url: null, routerLink: "/search-brn", class: "", roles: [] },
    { label: "Dashboard", url: null, routerLink: "/dashboard", class: "", roles: [] },
    { label: "FAQ", url: null, routerLink: "/faq", class: "", roles: [] },
    { label: "Circular", url: null, routerLink: "/circular", class: "", roles: [] },
    { label: "citizen-dashboard", url: null, routerLink: "/citizen-dashboard", class: "", roles: [] }
    
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