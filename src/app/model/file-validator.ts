// src/app/validators/file-validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fileRequiredValidator(control: AbstractControl): ValidationErrors | null {
  return control.value ? null : { requiredFile: true };
}
