import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
    private defaultLang = 'en';
  private storageKey = 'lang';
  private isBrowser: boolean;

  private languageSubject: BehaviorSubject<string>;   // ✅ NEW subject to track language

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.translate.addLangs(['en', 'mr']);

    const savedLang = this.isBrowser
      ? localStorage.getItem(this.storageKey) || this.defaultLang
      : this.defaultLang;

    this.languageSubject = new BehaviorSubject<string>(savedLang);  // ✅ Initialize subject

    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);

    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, lang);
    }

    this.languageSubject.next(lang);   // ✅ Notify subscribers when language changes
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;   // ✅ Return value from subject instead of localStorage
  }

  getAvailableLanguages(): string[] {
    return this.translate.getLangs();
  }

  getLanguageObservable(): Observable<string> {       // ✅ NEW method
    return this.languageSubject.asObservable();
  }
}
