import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noNumbersValidator(
  control: AbstractControl
): ValidationErrors | null {

  const value = control.value;
  if (!value) return null;

  const hasNumbers = /\d/.test(value);

  return hasNumbers ? { noNumbers: true } : null;
}
