import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

type SupportedLanguage = 'en' | 'mr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly defaultLang: SupportedLanguage = 'en';
  private readonly storageKey = 'lang';
  private readonly supportedLanguages: SupportedLanguage[] = ['en', 'mr'];
  private readonly languageFonts: Record<SupportedLanguage, string> = {
    en: '"Times New Roman", Times, serif',
    mr: '"DVOT SurekhMR", "Noto Sans Devanagari", serif'
  };
  private readonly isBrowser: boolean;
  private readonly languageSubject: BehaviorSubject<string>;

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.translate.addLangs(this.supportedLanguages);

    const savedLang = this.isBrowser
      ? localStorage.getItem(this.storageKey) || this.defaultLang
      : this.defaultLang;

    this.languageSubject = new BehaviorSubject<string>(this.normalizeLanguage(savedLang));

    this.setLanguage(savedLang);
  }

  setLanguage(lang: string): void {
    const normalizedLang = this.normalizeLanguage(lang);

    this.translate.use(normalizedLang);
    this.applyLanguageStyling(normalizedLang);

    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, normalizedLang);
    }

    this.languageSubject.next(normalizedLang);
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }

  getAvailableLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  getLanguageObservable(): Observable<string> {
    return this.languageSubject.asObservable();
  }

  private normalizeLanguage(lang: string): SupportedLanguage {
    return this.supportedLanguages.includes(lang as SupportedLanguage)
      ? (lang as SupportedLanguage)
      : this.defaultLang;
  }

  private applyLanguageStyling(lang: SupportedLanguage): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.style.setProperty(
      '--app-font-family',
      this.languageFonts[lang]
    );

    const body = this.document.body;
    if (!body) {
      return;
    }

    body.classList.remove(...this.supportedLanguages.map(language => `lang-${language}`));
    body.classList.add(`lang-${lang}`);
  }
}
