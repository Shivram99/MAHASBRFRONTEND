import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    localStorage.removeItem('lang');
    document.body.classList.remove('lang-en', 'lang-mr');
    document.documentElement.style.removeProperty('--app-font-family');

    translateService = jasmine.createSpyObj<TranslateService>('TranslateService', [
      'addLangs',
      'use'
    ]);

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateService },
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorage.removeItem('lang');
    document.body.classList.remove('lang-en', 'lang-mr');
    document.documentElement.style.removeProperty('--app-font-family');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply Times New Roman when English is selected', () => {
    service.setLanguage('en');

    expect(translateService.use).toHaveBeenCalledWith('en');
    expect(service.getCurrentLanguage()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.style.getPropertyValue('--app-font-family')).toContain('Times New Roman');
    expect(document.body.classList.contains('lang-en')).toBeTrue();
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('should apply DVOT SurekhMR when Marathi is selected', () => {
    service.setLanguage('mr');

    expect(translateService.use).toHaveBeenCalledWith('mr');
    expect(service.getCurrentLanguage()).toBe('mr');
    expect(document.documentElement.lang).toBe('mr');
    expect(document.documentElement.style.getPropertyValue('--app-font-family')).toContain('DVOT SurekhMR');
    expect(document.body.classList.contains('lang-mr')).toBeTrue();
    expect(localStorage.getItem('lang')).toBe('mr');
  });

  it('should fall back to English styling for unsupported languages', () => {
    service.setLanguage('hi');

    expect(translateService.use).toHaveBeenCalledWith('en');
    expect(service.getCurrentLanguage()).toBe('en');
    expect(document.documentElement.style.getPropertyValue('--app-font-family')).toContain('Times New Roman');
    expect(document.body.classList.contains('lang-en')).toBeTrue();
  });
});
