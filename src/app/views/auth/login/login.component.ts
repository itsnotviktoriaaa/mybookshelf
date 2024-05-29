import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, CodeMessageHandlerUtil, NotificationService } from 'core/';
import { environment } from '../../../../environments/environment.development';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationStatusEnum, IUserInfoFromGoogle } from 'models/';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { SubscribeDecorator } from 'decorators/';
import { GoogleApiService } from 'core/';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgStyle,
    ReactiveFormsModule,
    SvgIconComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isShowPassword: boolean = false;
  errorMessage: string | null = null;
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private readonly googleApi: GoogleApiService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    //первый подход, когда использовался firebase
    this.googleApi.userProfileSubject.subscribe((info: IUserInfoFromGoogle | null) => {
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
        const messageKey = 'message.welcomeMessage';
        const message = this.translateService.instant(messageKey);
        this.notificationService.notifyAboutNotification({
          message: message,
          status: NotificationStatusEnum.success,
        });
        this.router.navigate(['/home']).then(() => {});
        console.log('----- Login ------');
      }),
      catchError(err => {
        this.errorMessage = CodeMessageHandlerUtil.handlerCodeMessage(
          err.code,
          this.translateService.currentLang
        );
        this.notificationService.notifyAboutNotificationLoader(false);
        this.notificationService.notifyAboutNotification({
          message: `${this.errorMessage}`,
          status: NotificationStatusEnum.error,
        });
        return EMPTY;
      })
    );
  }

  googleLogin(): void {
    this.googleApi.initiateAuthentication();
  }
}
