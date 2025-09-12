import { Component, OnInit } from '@angular/core';
import { User } from '../../../interface/user';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { Role } from '../../../model/user';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
rolesList: Role[] = [];
  users: User[] = [];
  newUser: User = {
    username: '',
    email: '',
    roles: [],  // user must select
    isFirstTimeLogin: true,
    userProfile: {
      fullName: '',
      officeName: '',
      officeAddress: '',
      mobileNumber: ''
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
   this.loadUsers();
   this.loadRoles();
  }

  // loadUsers(): void {
  //   this.userService.getUsers().subscribe({
  //     next: (data) => this.users = data,
  //     error: (err) => console.error('Error loading users', err)
  //   });
  // }
   loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users', err)
    });
  }

  addUser(form?: NgForm): void {
    // Ensure at least one role is selected
    if (!this.newUser.roles || this.newUser.roles.length === 0) {
      alert('Please select at least one role.');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: (res) => {
        alert('User created successfully!');
        this.resetForm();
        this.loadUsers();
      },
      error: (err) => console.error('Error creating user', err)
    });
  }

  editUser(user: User): void {
  this.newUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    isFirstTimeLogin: user.isFirstTimeLogin ?? true,
    roles: user.roles ?? ['ROLE_USER'], // default role if empty
    userProfile: {
      fullName: user.userProfile?.fullName ?? '',
      officeName: user.userProfile?.officeName ?? '',
      officeAddress: user.userProfile?.officeAddress ?? '',
      mobileNumber: user.userProfile?.mobileNumber ?? ''
    }
  };
}

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  resetForm(): void {
  this.newUser = {
    username: '',
    email: '',
    roles: ['ROLE_USER'], // default role
    isFirstTimeLogin: true,
    userProfile: {
      fullName: '',
      officeName: '',
      officeAddress: '',
      mobileNumber: ''
    }
  };
}

 loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => this.rolesList = roles,
      error: (err) => console.error('Failed to load roles', err)
    });
  }
}

