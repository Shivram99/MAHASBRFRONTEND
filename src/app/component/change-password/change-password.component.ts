import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangePasswordService } from '../../services/change-password.service';
import { ChangePasswordModel } from '../../model/change-password-model';
import { AuthService } from '../../services/auth.service';

/** Must match ChangePasswordModel.PASSWORD_REGEX in the backend. */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;
export const PASSWORD_RULE_TEXT =
  'Use 8-64 characters with an uppercase letter, a lowercase letter, a number and a symbol.';

type FieldErrors = Partial<Record<keyof ChangePasswordModel, string>>;

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css',
    standalone: false
})
export class ChangePasswordComponent implements OnInit {

  readonly passwordRuleText = PASSWORD_RULE_TEXT;

  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  fieldErrors: FieldErrors = {};
  errorMessage = '';
  isSaving = false;
  /** True when the user was sent here because they are still on a temporary password. */
  isFirstTimeLogin = false;

  constructor(
    private changePasswordService: ChangePasswordService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePasswordModel = new ChangePasswordModel();
    this.isFirstTimeLogin = this.authService.requiresPasswordChange();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = this.validate();
    if (Object.keys(this.fieldErrors).length > 0) {
      return;
    }

    this.isSaving = true;
    this.changePasswordService.changePassword(this.changePasswordModel).subscribe({
      next: () => {
        this.isSaving = false;
        void Swal.fire({
          title: 'Password Updated!',
          text: 'Please log in again with your new password.',
          icon: 'success'
        });
        this.authService.logout();
        void this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.errorMessage = this.describeError(error);
        console.error('Error occurred while changing password:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  /** Same rules as the backend, so users see problems before submitting. */
  private validate(): FieldErrors {
    const errors: FieldErrors = {};
    const { password, newPassword, newPasswordConfirm } = this.changePasswordModel;
    const username = this.authService.getCurrentUserSnapshot()?.username?.trim().toLowerCase() ?? '';

    if (!password) {
      errors.password = 'Current password is required.';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (!PASSWORD_PATTERN.test(newPassword)) {
      errors.newPassword = PASSWORD_RULE_TEXT;
    } else if (password && newPassword === password) {
      errors.newPassword = 'New password must be different from the current password.';
    } else if (username && newPassword.toLowerCase().includes(username)) {
      errors.newPassword = 'Password must not contain your username.';
    }

    if (!newPasswordConfirm) {
      errors.newPasswordConfirm = 'Please confirm the new password.';
    } else if (newPassword && newPasswordConfirm !== newPassword) {
      errors.newPasswordConfirm = 'Passwords do not match.';
    }

    return errors;
  }

  private describeError(error: HttpErrorResponse): string {
    const backendMessage = typeof error.error === 'string' ? error.error : error.error?.message;

    if (error.status === 409) {
      return backendMessage || 'Current password is incorrect.';
    }
    if (error.status === 400 && backendMessage) {
      return backendMessage;
    }
    if (error.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    return 'An error occurred. Please try again later.';
  }
}
