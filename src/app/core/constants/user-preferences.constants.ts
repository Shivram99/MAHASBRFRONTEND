import { AppLanguageCode, LanguageOption } from '../models/language.model';

export const APP_STORAGE_KEYS = {
  language: 'mahasbr.language',
  fontScale: 'mahasbr.fontScale'
} as const;

export const APP_DEFAULT_LANGUAGE: AppLanguageCode = 'en';

export const APP_LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    code: 'en',
    labelKey: 'LANGUAGE.ENGLISH',
    nativeLabel: 'English',
    ariaLabelKey: 'LANGUAGE.SELECT_ENGLISH'
  },
  {
    code: 'mr',
    labelKey: 'LANGUAGE.MARATHI',
    nativeLabel: 'मराठी',
    ariaLabelKey: 'LANGUAGE.SELECT_MARATHI'
  }
] as const;

export const FONT_SCALE_LIMITS = {
  min: 85,
  max: 125,
  default: 100,
  step: 5
} as const;
