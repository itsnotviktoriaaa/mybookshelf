import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
})
export class LoginComponent {
  isShowPassword: boolean = false;

  changeShowingPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }
}
