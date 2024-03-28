import { Component, inject, OnDestroy } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationStatus } from '../../../../types/user.interface';
import { CodeMessageHandlerUtil } from '../../../shared/utils/code-message-handler.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, FormsModule, NgStyle, ReactiveFormsModule],
})
export class LoginComponent implements OnDestroy {
  isShowPassword: boolean = false;
  loginForm: FormGroup;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  notificationService: NotificationService = inject(NotificationService);
  errorMessage: string | null = null;
  subscription1: Subscription | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    });
  }

  changeShowingPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  login(): void {
    this.notificationService.notifyAboutNotificationLoader(true);
    this.subscription1 = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
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
