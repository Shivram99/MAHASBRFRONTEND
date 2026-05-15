export type AppLanguageCode = 'en' | 'mr';

export interface LanguageOption {
  code: AppLanguageCode;
  labelKey: string;
  nativeLabel: string;
  ariaLabelKey: string;
}
