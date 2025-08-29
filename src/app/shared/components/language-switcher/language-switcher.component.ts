import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service'; 

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.css'],
    standalone: false
})
export class LanguageSwitcherComponent {
  languages = ['en', 'mr'];
selectedLang: string = 'en'; 

  constructor(private langService: LanguageService) {
    this.languages = this.langService.getAvailableLanguages();
    this.selectedLang = this.langService.getCurrentLanguage();
  }

//   toggleLanguage() {
//   this.selectedLang = this.selectedLang === 'en' ? 'mr' : 'en';
//   this.onLanguageChange(this.selectedLang);
// }
 // default language

toggleLanguage() {
  this.selectedLang = this.selectedLang === 'en' ? 'mr' : 'en';
  this.onLanguageChange(this.selectedLang);
}

onLanguageChange(lang: string) {
   this.selectedLang = lang;
   this.langService.setLanguage(lang);
  // console.log("Language changed to:", lang);
}

// onLanguageChange(event: Event) {
//   const selectElement = event.target as HTMLSelectElement | null;
//   if (selectElement) {
//     const lang = selectElement.value;
//     this.selectedLang = lang;
//     this.langService.setLanguage(lang);
//   }
// }

}
