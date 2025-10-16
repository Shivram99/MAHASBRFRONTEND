import { Component, OnInit } from '@angular/core';
import { User } from '../../../interface/user';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { Role } from '../../../model/user';
import { firstValueFrom } from 'rxjs';
import { RegistryResponse } from '../../../model/registry-response';
import { RegistryServiceService } from '../../../services/registry-master/registry-service.service';
import { DivisionService } from '../../../services/divison/division.service';
import { Division } from '../../../model/division';
import { DistrictService } from '../../../services/district/district.service';
import { District } from '../../../model/district';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  rolesList: Role[] = [];
  users: User[] = [];
  registries: RegistryResponse[] = [];
  loading = false;
  division:Division[]=[];
  district:District[]=[];

  newUser: User = this.getEmptyUser();

  constructor(
    private userService: UserService,
    private registryService: RegistryServiceService,
    private divisionService: DivisionService,
    private districtService: DistrictService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadRegistries();
    this.loadDivisions();
    this.loadDistricts();
  }

  // -------------------------
// Add or Update User
// -------------------------
saveUser(form: NgForm): void {
  if (!form.valid) {
    form.control.markAllAsTouched(); // trigger validation
    return;
  }

  if (this.newUser.id) {
    // Update existing user
    this.userService.updateUser(this.newUser.id, this.newUser).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.resetForm(form);
        this.loadUsers();
      },
      error: err => console.error('Error updating user', err)
    });
  } else {
    // Create new user
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert('User saved successfully!');
        this.resetForm(form);
        this.loadUsers();
      },
      error: err => console.error('Error saving user', err)
    });
  }
}
  // -------------------------
  // Load Data
  // -------------------------
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: err => console.error('Failed to load users', err)
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: roles => this.rolesList = roles,
      error: err => console.error('Failed to load roles', err)
    });
  }

  loadRegistries(): void {
    this.loading = true;
    this.registryService.getAll().subscribe({
      next: data => {
        this.registries = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // -------------------------
  // Helper: Determine if Registry field should show
  // -------------------------
  get canShowRegistry(): boolean {
    return this.newUser.roles?.includes('ROLE_REG_AUTH_API') ||
           this.newUser.roles?.includes('ROLE_REG_AUTH_CSV') || false;
  }


  // -------------------------
  // Add or Update User
  // -------------------------
  addUser(form: NgForm): void {
    if (!form.valid) {
      form.control.markAllAsTouched(); // trigger validation
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert('User saved successfully!');
        this.resetForm(form);
        this.loadUsers();
      },
      error: err => console.error('Error saving user', err)
    });
  }

  // -------------------------
  // Edit User
  // -------------------------
  editUser(user: User): void {
    this.newUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isFirstTimeLogin: user.isFirstTimeLogin ?? true,
      roles: user.roles ?? [],
      registryId: user.registryId,
      districtId: user.districtId,
      divisionCode: user.divisionCode,
      userProfile: {
        fullName: user.userProfile?.fullName ?? '',
        officeName: user.userProfile?.officeName ?? '',
        officeAddress: user.userProfile?.officeAddress ?? '',
        mobileNumber: user.userProfile?.mobileNumber ?? ''
      }
    };
  }

  // -------------------------
  // Delete User
  // -------------------------
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Error deleting user', err)
      });
    }
  }

  // -------------------------
  // Reset Form
  // -------------------------
  resetForm(form?: NgForm): void {
    this.newUser = this.getEmptyUser();
    form?.resetForm(this.newUser);
  }

  private getEmptyUser(): User {
    return {
      username: '',
      email: '',
      roles: [],               // must select at least one
      registryId: undefined,
      districtId: undefined,
      divisionCode: undefined,
      isFirstTimeLogin: true,
      userProfile: {
        fullName: '',
        officeName: '',
        officeAddress: '',
        mobileNumber: ''
      }
    };
  }
//load the division
  loadDivisions(): void {
  this.divisionService.getAllDivisions().subscribe({
    next: (data: Division[]) => {
      this.division = data || []; // fallback in case of null/undefined
      console.info(data)
    },
    error: (err) => {
      console.error('Error loading divisions:', err);
      // Optional: show a user-friendly error
      // this.toastr.error('Failed to load divisions. Please try again later.');
    }
  });
}
  // -------------------------
  // Helper: Determine if Registry field should show
  // -------------------------
  get canShowDivision(): boolean {
    return this.newUser.roles?.includes('ROLE_DES_REGION') || false;
  }

loadDistricts(): void {
  this.districtService.getAll().subscribe({
    next: (data: District[]) => {
      this.district = data || []; // fallback in case of null/undefined
      console.info('Districts loaded:', this.district);
    },
    error: (err) => {
      console.error('Error loading districts:', err);
      // Optional: show a user-friendly error message
      // this.toastr.error('Failed to load districts. Please try again later.');
    }
  });
}

get canShowDistrict(): boolean {
    return this.newUser.roles?.includes('ROLE_DES_DISTRICT') || false;
  }

}

