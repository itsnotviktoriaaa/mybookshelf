import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core';
import { NotificationService } from '../../../shared/services';
import { CodeMessageHandlerUtil } from '../../../shared/utils';
import { NotificationStatus } from '../../../types/auth';
import { catchError, EMPTY, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { UserInfoFromGoogle } from '../../../types/auth';
import { GoogleApiService } from '../../../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgStyle, ReactiveFormsModule, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isShowPassword: boolean = false;
  errorMessage: string | null = null;
  subscription1: Subscription | null = null;
  loginDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private readonly googleApi: GoogleApiService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    //первый подход, когда использовался firebase
    this.googleApi.userProfileSubject.subscribe((info: UserInfoFromGoogle | null) => {
      if (info) {
        this.router.navigate(['/home']).then(() => {});
      }
    });
  }

  changeShowingPassword(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  login(): void {
    this.notificationService.notifyAboutNotificationLoader(true);
    this.subscription1 = this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        tap(() => {
          this.notificationService.notifyAboutNotificationLoader(false);
          this.notificationService.notifyAboutNotification({
            message: 'Welcome in MyBookShelf',
            status: NotificationStatus.success,
          });
          this.router.navigate(['/home']).then(() => {});
          console.log('----- Login ------');
        }),
        catchError(err => {
          this.errorMessage = CodeMessageHandlerUtil.handlerCodeMessage(err.code);
          this.notificationService.notifyAboutNotificationLoader(false);
          this.notificationService.notifyAboutNotification({
            message: `${this.errorMessage}`,
            status: NotificationStatus.error,
          });
          return EMPTY;
        }),
        takeUntil(this.loginDestroy$)
      )
      .subscribe();
  }

  googleLogin(): void {
    this.googleApi.initiateAuthentication();
  }

  ngOnDestroy(): void {
    this.loginDestroy$.next();
    this.loginDestroy$.complete();
  }
}
