import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
private readonly TOKEN_KEY = 'accessToken';
private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public saveToken(token: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  public removeToken(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
