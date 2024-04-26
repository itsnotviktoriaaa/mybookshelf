import { Constants } from '../utils';
import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordNotEmail]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordNotEmailDirective, multi: true }],
})
export class PasswordNotEmailDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email');
    const password = control.get('password');

    if (!password || !password.value) {
      password?.setErrors({ required: true });
      return { required: true };
    }

    if (email?.value === password?.value) {
      password?.setErrors({ passwordAsEmail: true });
      return { passwordAsEmail: true };
    }

    if (email?.value !== password?.value && password.hasError('passwordAsEmail')) {
      password.setErrors({ passwordAsEmail: null });
      if (!password.value.match(Constants.regularForPassword)) {
        password.setErrors({ pattern: true });
      }
      return { passwordAsEmail: null };
    }

    return null;
  }
}
