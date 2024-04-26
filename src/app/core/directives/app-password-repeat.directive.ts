import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordRepeat]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordRepeatDirective, multi: true }],
})
export class PasswordRepeatDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if ((!password || !password.value) && (!confirmPassword || !confirmPassword.value)) {
      confirmPassword?.setErrors({ required: true });
      password?.setErrors({ required: true });
      return { required: true };
    }

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordRepeat: true });
      return { passwordRepeat: true };
    }
    return null;
  }
}
