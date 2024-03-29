import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core';
import { NotificationService, CodeMessageHandlerUtil } from '../../../shared';
import { NotificationStatus } from '../../../../types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, FormsModule, NgStyle, ReactiveFormsModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  isShowPassword: boolean = false;
  loginForm: FormGroup | null = null;
  fb: FormBuilder = inject(FormBuilder);
  errorMessage: string | null = null;
  subscription1: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  changeShowingPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  login(): void {
    this.notificationService.notifyAboutNotificationLoader(true);
    this.subscription1 = this.authService.login(this.loginForm?.value.email, this.loginForm?.value.password).subscribe({
      next: (): void => {
        this.notificationService.notifyAboutNotificationLoader(false);
        this.notificationService.notifyAboutNotification({ message: 'Welcome in MyBookShelf', status: NotificationStatus.success });
        //router to home
        this.router.navigate(['/home']).then(() => {});
        console.log('----- Login ------');
      },
      error: (err): void => {
        this.errorMessage = CodeMessageHandlerUtil.handlerCodeMessage(err.code);
        this.notificationService.notifyAboutNotificationLoader(false);
        this.notificationService.notifyAboutNotification({ message: `${this.errorMessage}`, status: NotificationStatus.error });
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
  }
}
