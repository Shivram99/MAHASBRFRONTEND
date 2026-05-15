import { Component, OnInit } from '@angular/core';
import { User } from '../../../interface/user';
import { UserService, UserServiceError } from '../../../services/user.service';
import { Role } from '../../../model/user';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RegistryResponse } from '../../../model/registry-response';
import { RegistryServiceService } from '../../../services/registry-master/registry-service.service';
import { DivisionService } from '../../../services/divison/division.service';
import { Division } from '../../../model/division';
import { DistrictService } from '../../../services/district/district.service';
import { District } from '../../../model/district';
import {
  resolveRequiredLocationFields,
  USER_LOCATION_FIELDS,
  UserLocationField
} from './user-role-location.config';

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
  divisions: Division[] = [];
  districts: District[] = [];
  searchText = '';
  isSaving = false;
  submissionMessage = '';
  submissionMessageType: 'success' | 'danger' | '' = '';
  readonly userForm: FormGroup;
  private visibleLocationFields = new Set<UserLocationField>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private registryService: RegistryServiceService,
    private divisionService: DivisionService,
    private districtService: DistrictService
  ) {
    this.userForm = this.fb.group({
      id: [null as number | null],
      username: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      isFirstTimeLogin: [true],
      roles: [[], [this.minArrayLengthValidator(1)]],
      registryId: [{ value: null as number | null, disabled: true }],
      divisionCode: [{ value: null as string | null, disabled: true }],
      districtId: [{ value: null as number | null, disabled: true }],
      userProfile: this.fb.group({
        fullName: ['', [Validators.required]],
        officeName: ['', [Validators.required]],
        officeAddress: [''],
        mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
      })
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.rolesControl.valueChanges.subscribe((roles) => {
      this.applyRoleBasedLocationRules(roles ?? []);
      this.clearSubmissionMessage();
    });
    this.applyRoleBasedLocationRules(this.rolesControl.value ?? []);
  }

  get rolesControl(): AbstractControl<string[]> {
    return this.userForm.get('roles') as AbstractControl<string[]>;
  }

  saveUser(): void {
    this.clearSubmissionMessage();
    this.clearServerErrors();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.buildSubmissionPayload();
    const request$ = payload.id
      ? this.userService.updateUser(payload.id, payload)
      : this.userService.createUser(payload);

    this.isSaving = true;
    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.submissionMessageType = 'success';
        this.submissionMessage = payload.id ? 'User updated successfully.' : 'User saved successfully.';
        this.resetForm();
        this.loadUsers();
      },
      error: (error: UserServiceError) => {
        this.isSaving = false;
        this.handleSubmissionError(error);
      }
    });
  }

  editUser(user: User): void {
    const formValue = {
      id: user.id,
      username: user.username,
      email: user.email,
      isFirstTimeLogin: user.isFirstTimeLogin ?? true,
      roles: user.roles ?? [],
      registryId: user.registryId ?? null,
      districtId: user.districtId ?? null,
      divisionCode: user.divisionCode ?? null,
      userProfile: {
        fullName: user.userProfile?.fullName ?? '',
        officeName: user.userProfile?.officeName ?? '',
        officeAddress: user.userProfile?.officeAddress ?? '',
        mobileNumber: user.userProfile?.mobileNumber ?? ''
      }
    };

    this.userForm.reset(formValue, { emitEvent: false });
    this.applyRoleBasedLocationRules(formValue.roles);
    this.clearSubmissionMessage();
    this.clearServerErrors();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Error deleting user', err)
      });
    }
  }

  resetForm(): void {
    this.userForm.reset(this.getEmptyUser(), { emitEvent: false });
    this.applyRoleBasedLocationRules([]);
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.clearServerErrors();
  }

  private getEmptyUser(): User {
    return {
      id: undefined,
      username: '',
      email: '',
      roles: [],
      registryId: null,
      districtId: null,
      divisionCode: null,
      isFirstTimeLogin: true,
      userProfile: {
        fullName: '',
        officeName: '',
        officeAddress: '',
        mobileNumber: ''
      }
    };
  }

  isLocationFieldVisible(field: UserLocationField): boolean {
    return this.visibleLocationFields.has(field);
  }

  hasControlError(controlPath: string, errorKey?: string): boolean {
    const control = this.userForm.get(controlPath);
    if (!control || !control.touched) {
      return false;
    }

    return errorKey ? control.hasError(errorKey) : control.invalid;
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearSubmissionMessage();
  }

  getControlErrorMessage(controlPath: string): string {
    const control = this.userForm.get(controlPath);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['server']) {
      return control.errors['server'];
    }

    if (control.errors['required']) {
      switch (controlPath) {
        case 'username':
          return 'Username is required.';
        case 'email':
          return 'Email is required.';
        case 'roles':
          return 'At least one role must be selected.';
        case 'registryId':
          return 'Registry selection is required.';
        case 'divisionCode':
          return 'Division selection is required.';
        case 'districtId':
          return 'District selection is required.';
        case 'userProfile.fullName':
          return 'Full Name is required.';
        case 'userProfile.officeName':
          return 'Office Name is required.';
        case 'userProfile.mobileNumber':
          return 'Mobile Number is required.';
        default:
          return 'This field is required.';
      }
    }

    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }

    if (control.errors['pattern'] && controlPath === 'userProfile.mobileNumber') {
      return 'Mobile Number must be exactly 10 digits.';
    }

    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed.`;
    }

    if (control.errors['minArrayLength']) {
      return 'At least one role must be selected.';
    }

    return 'Invalid value.';
  }

  private loadInitialData(): void {
    forkJoin({
      users: this.userService.getUsers(),
      roles: this.userService.getRoles(),
      registries: this.registryService.getAll(),
      divisions: this.divisionService.getAllDivisions(),
      districts: this.districtService.getAll()
    }).subscribe({
      next: ({ users, roles, registries, divisions, districts }) => {
        this.users = users;
        this.rolesList = roles;
        this.registries = registries;
        this.divisions = divisions ?? [];
        this.districts = districts ?? [];
      },
      error: (error) => {
        console.error('Failed to load user management data', error);
        this.submissionMessageType = 'danger';
        this.submissionMessage = 'Unable to load user management data. Please refresh and try again.';
      }
    });
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Failed to load users', error);
        this.submissionMessageType = 'danger';
        this.submissionMessage = 'Unable to refresh the user list right now.';
      }
    });
  }

  private applyRoleBasedLocationRules(roles: string[]): void {
    this.visibleLocationFields = resolveRequiredLocationFields(roles);

    USER_LOCATION_FIELDS.forEach((field) => {
      const control = this.userForm.get(field);
      if (!control) {
        return;
      }

      if (this.visibleLocationFields.has(field)) {
        control.enable({ emitEvent: false });
        control.setValidators([Validators.required]);
      } else {
        control.reset(null, { emitEvent: false });
        control.clearValidators();
        control.disable({ emitEvent: false });
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  private buildSubmissionPayload(): User {
    const rawValue = this.userForm.getRawValue() as User;
    const requiredFields = resolveRequiredLocationFields(rawValue.roles);

    return {
      ...rawValue,
      registryId: requiredFields.has('registryId') ? rawValue.registryId ?? null : null,
      divisionCode: requiredFields.has('divisionCode') ? rawValue.divisionCode ?? null : null,
      districtId: requiredFields.has('districtId') ? rawValue.districtId ?? null : null,
      userProfile: {
        ...rawValue.userProfile!,
        fullName: rawValue.userProfile?.fullName?.trim() ?? '',
        officeName: rawValue.userProfile?.officeName?.trim() ?? '',
        officeAddress: rawValue.userProfile?.officeAddress?.trim() ?? '',
        mobileNumber: rawValue.userProfile?.mobileNumber?.trim() ?? ''
      },
      username: rawValue.username.trim(),
      email: rawValue.email.trim()
    };
  }

  private handleSubmissionError(error: UserServiceError): void {
    console.error('User form submission failed', error);
    this.submissionMessageType = 'danger';
    this.submissionMessage = error.message || 'Unable to save user details right now.';
    this.applyServerErrors(error.validationErrors);
  }

  private applyServerErrors(validationErrors?: Record<string, string>): void {
    if (!validationErrors) {
      return;
    }

    Object.entries(validationErrors).forEach(([path, message]) => {
      const control = this.userForm.get(path);
      if (!control) {
        return;
      }

      control.setErrors({ ...(control.errors ?? {}), server: message });
      control.markAsTouched();
    });
  }

  private clearServerErrors(): void {
    this.clearServerErrorRecursively(this.userForm);
  }

  private clearServerErrorRecursively(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((childControl) => this.clearServerErrorRecursively(childControl));
      return;
    }

    if (!control.errors?.['server']) {
      return;
    }

    const { server, ...remainingErrors } = control.errors;
    void server;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  private clearSubmissionMessage(): void {
    this.submissionMessage = '';
    this.submissionMessageType = '';
  }

  private minArrayLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length >= minLength
        ? null
        : { minArrayLength: { requiredLength: minLength } };
    };
  }

}

