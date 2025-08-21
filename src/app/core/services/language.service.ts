import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
   private defaultLang = 'en';
  private storageKey = 'lang';
  private isBrowser: boolean;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.translate.addLangs(['en', 'mr']); // Supported languages

    const savedLang = this.isBrowser
      ? localStorage.getItem(this.storageKey) || this.defaultLang
      : this.defaultLang;

    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, lang);
    }
  }

  getCurrentLanguage(): string {
    return this.isBrowser
      ? localStorage.getItem(this.storageKey) || this.defaultLang
      : this.defaultLang;
  }

  getAvailableLanguages(): string[] {
    return this.translate.getLangs();
  }
}
