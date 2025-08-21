import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service'; 

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  languages: string[];
  selectedLang: string;

  constructor(private langService: LanguageService) {
    this.languages = this.langService.getAvailableLanguages();
    this.selectedLang = this.langService.getCurrentLanguage();
  }


onLanguageChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement | null;
  if (selectElement) {
    const lang = selectElement.value;
    this.selectedLang = lang;
    this.langService.setLanguage(lang);
  }
}

}
