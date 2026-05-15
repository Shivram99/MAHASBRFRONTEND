import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { FONT_SCALE_LIMITS, APP_STORAGE_KEYS } from '../constants/user-preferences.constants';
import { FontScaleState } from '../models/accessibility.model';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly isBrowser: boolean;
  private readonly fontScaleSubject = new BehaviorSubject<number>(FONT_SCALE_LIMITS.default);

  readonly fontScale$ = this.fontScaleSubject.asObservable();
  readonly fontScaleState$: Observable<FontScaleState> = this.fontScale$.pipe(
    map((scale) => ({
      scale,
      canDecrease: scale > FONT_SCALE_LIMITS.min,
      canIncrease: scale < FONT_SCALE_LIMITS.max
    }))
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async initialize(): Promise<void> {
    const scale = this.readStoredScale();
    this.applyFontScale(scale);
    this.fontScaleSubject.next(scale);
  }

  getCurrentFontScale(): number {
    return this.fontScaleSubject.value;
  }

  getFontScaleObservable(): Observable<number> {
    return this.fontScale$;
  }

  getFontScaleStateObservable(): Observable<FontScaleState> {
    return this.fontScaleState$;
  }

  decreaseFontSize(): void {
    this.setFontScale(this.fontScaleSubject.value - FONT_SCALE_LIMITS.step);
  }

  increaseFontSize(): void {
    this.setFontScale(this.fontScaleSubject.value + FONT_SCALE_LIMITS.step);
  }

  resetFontSize(): void {
    this.setFontScale(FONT_SCALE_LIMITS.default);
  }

  setFontScale(scale: number): void {
    const normalizedScale = this.normalizeScale(scale);
    this.applyFontScale(normalizedScale);
    this.persistScale(normalizedScale);
    this.fontScaleSubject.next(normalizedScale);
  }

  private readStoredScale(): number {
    if (!this.isBrowser) {
      return FONT_SCALE_LIMITS.default;
    }

    const storedValue = window.localStorage.getItem(APP_STORAGE_KEYS.fontScale);

    if (!storedValue) {
      return FONT_SCALE_LIMITS.default;
    }

    return this.normalizeScale(Number(storedValue));
  }

  private persistScale(scale: number): void {
    if (!this.isBrowser) {
      return;
    }

    window.localStorage.setItem(APP_STORAGE_KEYS.fontScale, String(scale));
  }

  private normalizeScale(scale: number): number {
    if (Number.isNaN(scale)) {
      return FONT_SCALE_LIMITS.default;
    }

    return Math.min(FONT_SCALE_LIMITS.max, Math.max(FONT_SCALE_LIMITS.min, scale));
  }

  private applyFontScale(scale: number): void {
    const rootElement = this.document.documentElement;
    rootElement.style.setProperty('--app-font-scale-percent', `${scale}%`);
    rootElement.style.setProperty('--app-font-scale-ratio', `${scale / 100}`);
    rootElement.setAttribute('data-font-scale', String(scale));
  }
}
