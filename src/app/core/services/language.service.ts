import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, catchError, firstValueFrom, of } from 'rxjs';
import {
  APP_DEFAULT_LANGUAGE,
  APP_LANGUAGE_OPTIONS,
  APP_STORAGE_KEYS
} from '../constants/user-preferences.constants';
import { AppLanguageCode, LanguageOption } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly supportedLanguages: AppLanguageCode[] = APP_LANGUAGE_OPTIONS.map(
    ({ code }) => code
  );
  private readonly languageFonts: Record<AppLanguageCode, string> = {
    en: '"Times New Roman", Times, serif',
    mr: '"DVOT SurekhMR", "Noto Sans Devanagari", serif'
  };
  private readonly isBrowser: boolean;
  private readonly languageSubject = new BehaviorSubject<AppLanguageCode>(APP_DEFAULT_LANGUAGE);

  constructor(
    private readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async initialize(): Promise<void> {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setDefaultLang(APP_DEFAULT_LANGUAGE);

    const savedLanguage = this.readStoredLanguage();
    const normalizedLanguage = this.normalizeLanguage(savedLanguage);

    await this.useLanguage(normalizedLanguage);
  }

  setLanguage(language: string): void {
    const normalizedLanguage = this.normalizeLanguage(language);
    void this.useLanguage(normalizedLanguage);
  }

  getCurrentLanguage(): AppLanguageCode {
    return this.languageSubject.value;
  }

  getAvailableLanguages(): AppLanguageCode[] {
    return [...this.supportedLanguages];
  }

  getLanguageOptions(): readonly LanguageOption[] {
    return APP_LANGUAGE_OPTIONS;
  }

  getLanguageObservable(): Observable<AppLanguageCode> {
    return this.languageSubject.asObservable();
  }

  private async useLanguage(language: AppLanguageCode): Promise<void> {
    this.applyLanguageStyling(language);
    this.persistLanguage(language);
    this.languageSubject.next(language);

    await firstValueFrom(
      this.translate.use(language).pipe(
        catchError(() => {
          if (language !== APP_DEFAULT_LANGUAGE) {
            this.applyLanguageStyling(APP_DEFAULT_LANGUAGE);
            this.persistLanguage(APP_DEFAULT_LANGUAGE);
            this.languageSubject.next(APP_DEFAULT_LANGUAGE);
            return this.translate.use(APP_DEFAULT_LANGUAGE);
          }

          return of({});
        })
      )
    );
  }

  private readStoredLanguage(): AppLanguageCode {
    if (!this.isBrowser) {
      return APP_DEFAULT_LANGUAGE;
    }

    const storedLanguage = window.localStorage.getItem(APP_STORAGE_KEYS.language);
    return this.normalizeLanguage(storedLanguage);
  }

  private persistLanguage(language: AppLanguageCode): void {
    if (!this.isBrowser) {
      return;
    }

    window.localStorage.setItem(APP_STORAGE_KEYS.language, language);
  }

  private normalizeLanguage(language: string | null): AppLanguageCode {
    return this.supportedLanguages.includes(language as AppLanguageCode)
      ? (language as AppLanguageCode)
      : APP_DEFAULT_LANGUAGE;
  }

  private applyLanguageStyling(language: AppLanguageCode): void {
    const rootElement = this.document.documentElement;
    rootElement.lang = language;
    rootElement.setAttribute('data-language', language);
    rootElement.style.setProperty('--app-font-family', this.languageFonts[language]);
    rootElement.classList.remove(...this.supportedLanguages.map((code) => `lang-${code}`));
    rootElement.classList.add(`lang-${language}`);

    const body = this.document.body;
    if (!body) {
      return;
    }

    body.classList.remove(...this.supportedLanguages.map((code) => `lang-${code}`));
    body.classList.add(`lang-${language}`);
  }
}
