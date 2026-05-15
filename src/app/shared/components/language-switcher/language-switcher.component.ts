import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { AppLanguageCode, LanguageOption } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
  readonly languageOptions = this.languageService.getLanguageOptions();
  readonly currentLanguage$ = this.languageService.getLanguageObservable();

  constructor(private readonly languageService: LanguageService) {}

  selectLanguage(languageCode: AppLanguageCode): void {
    this.languageService.setLanguage(languageCode);
  }

  trackByCode(_: number, option: LanguageOption): AppLanguageCode {
    return option.code;
  }
}
