import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interface/user';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
   profileImage: string | null = null;
   user: User | null = null;
placeHolder = 'assets/images/profile.png';

constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }

  get userRolesDisplay(): string {
    const roles = this.user?.roles?.length ? this.user.roles : this.authService.getUserRoles();

    if (!roles?.length) {
      return 'Not Available';
    }

    return roles.map((role) => this.formatRoleName(role)).join(', ');
  }

  private formatRoleName(role: string): string {
    return role
      .replace(/^ROLE_/i, '')
      .split('_')
      .filter(Boolean)
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
}
