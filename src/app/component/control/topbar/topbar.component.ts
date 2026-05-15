import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessibilityService } from '../../../core/services/accessibility.service';
import { LanguageService } from '../../../core/services/language.service';
import { AppLanguageCode } from '../../../core/models/language.model';
import { AuthService } from '../../../services/auth.service';
import { LoggedInUser } from '../../../interface/logged-in-user';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css',
    standalone: false
})
export class TopbarComponent {
  readonly emblemImg = 'assets/images/emblem.png';
  readonly isLoggedIn$: Observable<boolean>;
  readonly currentUser$: Observable<LoggedInUser | null>;
  readonly currentLanguage$: Observable<AppLanguageCode>;
  readonly fontScale$ = this.accessibilityService.getFontScaleObservable();

  constructor(
    private readonly authService: AuthService,
    private readonly accessibilityService: AccessibilityService,
    private readonly languageService: LanguageService
  ) {
    this.isLoggedIn$ = this.authService.getIsLoggedIn();
    this.currentUser$ = this.authService.getCurrentUser();
    this.currentLanguage$ = this.languageService.getLanguageObservable();
  }

  decreaseFontSize(): void {
    this.accessibilityService.decreaseFontSize();
  }

  resetFontSize(): void {
    this.accessibilityService.resetFontSize();
  }

  increaseFontSize(): void {
    this.accessibilityService.increaseFontSize();
  }

  toggleLanguage(currentLanguage: AppLanguageCode): void {
    this.languageService.setLanguage(currentLanguage === 'en' ? 'mr' : 'en');
  }

  getFontControlLabel(
    currentLanguage: AppLanguageCode,
    variant: 'decrease' | 'reset' | 'increase'
  ): string {
    if (currentLanguage === 'mr') {
      if (variant === 'decrease') {
        return 'अ-';
      }

      if (variant === 'increase') {
        return 'अ+';
      }

      return 'अ';
    }

    if (variant === 'decrease') {
      return 'A-';
    }

    if (variant === 'increase') {
      return 'A+';
    }

    return 'A';
  }

  getDisplayedRole(user: LoggedInUser): string {
    return user.activeRole || user.roles?.[0] || '';
  }

  getDisplayedName(user: LoggedInUser): string {
    return user.fullName || user.username || '';
  }
}
