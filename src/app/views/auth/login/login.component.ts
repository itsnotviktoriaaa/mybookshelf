import { AuthService, CodeMessageHandlerUtil, DestroyDirective, NotificationService } from 'core/';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationStatusEnum, IUserInfoFromGoogle } from 'models/';
import { catchError, EMPTY, Observable, takeUntil, tap } from 'rxjs';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
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
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isShowPassword: boolean = false;
  errorMessage: string | null = null;
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

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

  loginObservable(): Observable<void> {
    return this.authService.login(this.loginForm.value.email, this.loginForm.value.password).pipe(
      tap(() => {
        this.notificationService.notifyAboutNotificationLoader(false);
        const messageKey = 'message.welcomeMessage';
        const message = this.translateService.instant(messageKey);
        this.notificationService.notifyAboutNotification({
          message: message,
          status: NotificationStatusEnum.SUCCESS,
        });
        this.router.navigate(['/home']).then(() => {});
        console.log('----- Login ------');
      }),
      takeUntil(this.destroy$),
      catchError(err => {
        this.errorMessage = CodeMessageHandlerUtil.handlerCodeMessage(
          err.code,
          this.translateService.currentLang
        );
        this.notificationService.notifyAboutNotificationLoader(false);
        this.notificationService.notifyAboutNotification({
          message: `${this.errorMessage}`,
          status: NotificationStatusEnum.ERROR,
        });
        return EMPTY;
      })
    );
  }

  googleLogin(): void {
    this.googleApi.initiateAuthentication();
  }
}
