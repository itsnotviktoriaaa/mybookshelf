import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, CodeMessageHandlerUtil, NotificationService } from '../../../core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { GoogleApiService } from '../../../core';
import { SubscribeDecorator } from '../../../decorators/subscribe-decorator';
import { NotificationStatus, UserInfoFromGoogle } from '../../../modals/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgStyle, ReactiveFormsModule, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isShowPassword: boolean = false;
  errorMessage: string | null = null;

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
    this.loginObservable().subscribe();
  }

  @SubscribeDecorator()
  loginObservable(): Observable<void> {
    return this.authService.login(this.loginForm.value.email, this.loginForm.value.password).pipe(
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
      })
    );
  }

  googleLogin(): void {
    this.googleApi.initiateAuthentication();
  }
}
