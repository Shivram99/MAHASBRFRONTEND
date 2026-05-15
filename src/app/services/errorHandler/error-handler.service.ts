import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private readonly translate: TranslateService) {}

  public getErrorMessage(
    error: HttpErrorResponse | null | undefined,
    fallbackKey = 'MESSAGES.UNEXPECTED_ERROR'
  ): string {
    if (!error) {
      return this.translate.instant(fallbackKey);
    }

    if (error.error?.messageKey) {
      return this.translate.instant(error.error.messageKey, error.error.params ?? {});
    }

    if (error.status === 0) {
      return this.translate.instant('MESSAGES.NETWORK_ERROR');
    }

    if (error.status === 404) {
      return this.translate.instant('MESSAGES.NOT_FOUND');
    }

    if (error.status === 500) {
      return this.translate.instant('MESSAGES.SERVER_ERROR');
    }

    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    return this.translate.instant(fallbackKey);
  }
}
