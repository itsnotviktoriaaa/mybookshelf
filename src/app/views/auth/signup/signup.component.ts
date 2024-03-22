import { Component } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordRepeatDirective } from '../../../shared/directives/app-password-repeat.directive';
import { PasswordNotEmailDirective } from '../../../shared/directives/app-password-not-email.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, FormsModule, ReactiveFormsModule, NgStyle, PasswordRepeatDirective, PasswordNotEmailDirective],
})
export class SignupComponent {
  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  changeShowingPassword(nameOfInput: string): void {
    if (nameOfInput === 'isShowPassword') {
      this.isShowPassword = !this.isShowPassword;
    } else if (nameOfInput === 'isShowConfirmPassword') {
      this.isShowConfirmPassword = !this.isShowConfirmPassword;
    }
  }

  sign(): void {
    console.log('----- All right sign ------');
  }
}
