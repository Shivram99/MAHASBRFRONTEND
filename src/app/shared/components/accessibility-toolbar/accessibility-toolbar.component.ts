import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FONT_SCALE_LIMITS } from '../../../core/constants/user-preferences.constants';
import { AccessibilityService } from '../../../core/services/accessibility.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-accessibility-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './accessibility-toolbar.component.html',
  styleUrls: ['./accessibility-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityToolbarComponent {
  @Input() showLoginLink = false;
  @Input() isLoggedIn = false;
  @Input() loginRoute = '/login';

  readonly fontScaleState$ = this.accessibilityService.getFontScaleStateObservable();
  readonly defaultScale = FONT_SCALE_LIMITS.default;

  constructor(private readonly accessibilityService: AccessibilityService) {}

  decreaseFontSize(): void {
    this.accessibilityService.decreaseFontSize();
  }

  resetFontSize(): void {
    this.accessibilityService.resetFontSize();
  }

  increaseFontSize(): void {
    this.accessibilityService.increaseFontSize();
  }
}
