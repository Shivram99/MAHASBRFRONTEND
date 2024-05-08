import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  private currentLanguageSubject: BehaviorSubject<string>;

  constructor(private translate: TranslateService) {
    this.currentLanguageSubject = new BehaviorSubject<string>(translate.currentLang);
  }

  getCurrentLanguage() {
    return this.currentLanguageSubject.value;
  }

  setCurrentLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguageSubject.next(language);
  }

  getLanguageObservable() {
    return this.currentLanguageSubject.asObservable();
  }
}