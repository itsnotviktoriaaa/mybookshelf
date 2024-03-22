import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
})
export class SignupComponent {
  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;

  changeShowingPassword(nameOfInput: string): void {
    if (nameOfInput === 'isShowPassword') {
      this.isShowPassword = !this.isShowPassword;
    } else if (nameOfInput === 'isShowConfirmPassword') {
      this.isShowConfirmPassword = !this.isShowConfirmPassword;
    }
  }
}
