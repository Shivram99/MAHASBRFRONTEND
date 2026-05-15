import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export type ValidationMessageConfig =
  | string
  | {
      key: string;
      params?: Record<string, unknown>;
    };

export type ValidationMessageMap = Record<string, ValidationMessageConfig>;

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {
  constructor(private readonly translate: TranslateService) {}

  getMessage(control: AbstractControl | null, messages: ValidationMessageMap): string {
    if (!control?.errors) {
      return '';
    }

    const [firstErrorKey] = Object.keys(control.errors);
    const messageConfig = messages[firstErrorKey];

    if (!messageConfig) {
      return this.translate.instant('VALIDATION.INVALID_FIELD');
    }

    if (typeof messageConfig === 'string') {
      return this.translate.instant(messageConfig);
    }

    const validatorPayload = control.getError(firstErrorKey);

    return this.translate.instant(messageConfig.key, {
      ...(typeof validatorPayload === 'object' ? validatorPayload : {}),
      ...(messageConfig.params ?? {})
    });
  }
}
