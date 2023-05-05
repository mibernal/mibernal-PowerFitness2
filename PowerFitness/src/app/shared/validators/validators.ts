import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minLengthValidator(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < minLength) {
      return { minlength: true };
    }
    return null;
  };
}
