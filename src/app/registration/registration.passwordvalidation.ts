import { AbstractControl } from '@angular/forms';

/**
 * The validation of two strings (if they match each other) is implemented in this class.
 */
export class PasswordValidation {

  static Match(mainInputName: string, repeatInputName: string) {
    return (AC: AbstractControl) => {
      const firstControlValue = AC.get(mainInputName).value;
      const secondControlValue = AC.get(repeatInputName).value;

      if (firstControlValue !== secondControlValue) {
        AC.get(repeatInputName).setErrors({ MatchFields: true });
      } else {
        return null;
      }
    };
  }
}
