import {
  AuthService,
  Constants,
  DestroyDirective,
  NotificationService,
  PasswordNotEmailDirective,
  PasswordRepeatDirective,
} from 'core/';
import { catchError, EMPTY, filter, finalize, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import emailJs, { EmailJSResponseStatus } from '@emailjs/browser';
import { NotificationStatusEnum, IUserSign } from 'models/';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthModule } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    ReactiveFormsModule,
    NgStyle,
    PasswordRepeatDirective,
    PasswordNotEmailDirective,
    AngularFireAuthModule,
    AuthModule,
    NgClass,
    SvgIconComponent,
    TranslateModule,
  ],
  hostDirectives: [DestroyDirective],
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  timeout: number = 0;

  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;

  errorMessage: string | null = null;
  infoFromUser: IUserSign | null = null;

  verification: boolean = false;
  verification$: Subject<boolean> = new Subject<boolean>();

  fillAllInputs: boolean = false;
  generatedCode: number | null = null;
  codeWhichWriteUser: string = '';
  codeWhichWrittenUserWasEqualFromEmail: boolean = false;

  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  @ViewChild('verificationBody') verificationBody: ElementRef | null = null;

  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.regularForPassword),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.verificationObservable().subscribe();
  }

  verificationObservable(): Observable<boolean> {
    return this.verification$.pipe(
      filter(params => params),
      tap(() => {
        this.timeout = window.setTimeout(() => {
          this.handleAllInputsForCode();
        }, 0);
      }),
      takeUntil(this.destroy$),
      finalize(() => {
        clearTimeout(this.timeout);
      })
    );
  }

  checkEmailWasUsedBeforeToSendCode(): void {
    console.log(this.registerForm.value.email);
    this.checkEmailWasUsedObservable().subscribe();
  }

  checkEmailWasUsedObservable(): Observable<string[]> {
    return this.authService.checkEmailWasUsed(this.registerForm.value.email).pipe(
      tap((param: Array<string>) => {
        if (param && param.length === 0) {
          this.sendCodeToEmail().then(() => {});
        } else {
          const messageKey = 'message.emailUsedBefore';
          const message = this.translateService.instant(messageKey);
          this.notificationService.sendNotification({
            message: message,
            status: NotificationStatusEnum.ERROR,
          });
        }
      }),
      takeUntil(this.destroy$),
      catchError(err => {
        const messageKey = 'message.somethingWentWrong';
        const message = this.translateService.instant(messageKey);
        this.notificationService.sendNotification({
          message: message,
          status: NotificationStatusEnum.ERROR,
        });
        console.log(err);
        return EMPTY;
      })
    );
  }

  handleAllInputsForCode(): void {
    if (this.verificationBody && this.verificationBody.nativeElement && this.verification) {
      const verificationInputs =
        this.verificationBody.nativeElement.querySelectorAll('.verification-number');

      for (let i: number = 0; i < verificationInputs.length; i++) {
        console.log('handle inputs');

        verificationInputs[i].addEventListener('keyup', (event: KeyboardEvent): void => {
          const currentValue: string = (event.target as HTMLInputElement)?.value;
          const currentCode: string = event.code;

          if (currentCode && currentCode === 'Backspace' && i !== 0) {
            verificationInputs[i - 1].focus();
          } else if (
            currentValue &&
            currentValue.length === 1 &&
            i < verificationInputs.length - 1
          ) {
            verificationInputs[i + 1].focus();
          }

          this.checkInputsForAbleButton(verificationInputs);
        });
      }
    }
  }

  keyPressOnInput(event: KeyboardEvent): boolean {
    const regExForInputWhenUserBuyCoins: RegExp = /^[0-9]$/;

    return !(!regExForInputWhenUserBuyCoins.test(event.key) && event.code !== 'Backspace');
  }

  changeShowingPassword(nameOfInput: string): void {
    this.isShowPassword =
      nameOfInput === 'isShowPassword' ? !this.isShowPassword : this.isShowPassword;
    this.isShowConfirmPassword =
      nameOfInput === 'isShowConfirmPassword'
        ? !this.isShowConfirmPassword
        : this.isShowConfirmPassword;
  }

  checkInputsForAbleButton(verificationInputs: NodeListOf<HTMLInputElement>): void {
    console.log(verificationInputs);
    this.fillAllInputs = Array.from(verificationInputs).every(
      (input: HTMLInputElement): boolean => {
        return input.value !== '';
      }
    );

    if (this.fillAllInputs) {
      this.getCodeFromInputsWhichWroteUser(verificationInputs);
      this.isCodeFromUserRight();
    }
  }

  getCodeFromInputsWhichWroteUser(verificationInputs: NodeListOf<HTMLInputElement>): void {
    this.codeWhichWriteUser = '';

    verificationInputs.forEach((input: HTMLInputElement): void => {
      console.log(input.value);
      this.codeWhichWriteUser += input.value;
    });
  }

  generateCode(): number {
    this.generatedCode = Math.floor(10000 + Math.random() * 90000);
    return this.generatedCode;
  }

  isCodeFromUserRight(): void {
    if (this.codeWhichWriteUser === this.generatedCode?.toString()) {
      console.log('Код введен идентичный сгенерированному');
      this.sign();
    } else {
      const messageKey = 'message.incorrectCode';
      const message = this.translateService.instant(messageKey);
      this.notificationService.sendNotification({
        message: message,
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  async sendCodeToEmail(): Promise<void> {
    this.notificationService.setNotificationLoader(true);

    if (!this.infoFromUser) {
      this.infoFromUser = {
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
      };
    }

    const code: number = this.generateCode();
    emailJs.init('sfDC-_rK_Ss_yoKZW');
    const response: EmailJSResponseStatus = await emailJs
      .send('service_1a450tp', 'template_023l37o', {
        from_name: 'The App My Book Shelf',
        to_name: this.infoFromUser.username,
        from_email: this.infoFromUser.email,
        subject: "It' your code",
        message: code,
      })
      .then((response: EmailJSResponseStatus) => response);

    this.responseFromEmailJsObservable(response).subscribe();
  }

  responseFromEmailJsObservable(
    response: EmailJSResponseStatus
  ): Observable<EmailJSResponseStatus> {
    return of(response).pipe(
      tap((response: EmailJSResponseStatus): void => {
        this.notificationService.setNotificationLoader(false);
        console.log('Success. Status: ' + response.text + ' ' + response.status);
        const messageKey = 'message.codeSentOnEmail';
        const message = this.translateService.instant(messageKey);
        this.notificationService.sendNotification({
          message: message,
          status: NotificationStatusEnum.SUCCESS,
        });

        if (!this.verification) {
          this.verification = true;
          this.verification$.next(true);
        }
      }),
      takeUntil(this.destroy$),
      catchError(error => {
        this.notificationService.setNotificationLoader(false);
        const messageKey = 'message.tryAgainMessage';
        const message = this.translateService.instant(messageKey);
        this.notificationService.sendNotification({
          message: message,
          status: NotificationStatusEnum.ERROR,
        });
        console.log('sth went wrong. Error ' + error.text + ' ' + error.status);
        return EMPTY;
      })
    );
  }

  backToRegister(): void {
    this.verification = false;
    this.registerForm.reset();
    this.errorMessage = null;
    this.router.navigate(['/signup']).then(() => {});
  }

  sign(): void {
    this.notificationService.setNotificationLoader(true);
    this.registerObservable().subscribe();
  }

  registerObservable(): Observable<void> {
    return this.authService
      .register(this.infoFromUser!.email, this.infoFromUser!.username, this.infoFromUser!.password)
      .pipe(
        tap(() => {
          this.notificationService.setNotificationLoader(false);
          this.verification = false;
          this.codeWhichWrittenUserWasEqualFromEmail = true;
          const messageKey = 'message.registrationSuccess';
          const message = this.translateService.instant(messageKey);
          this.notificationService.sendNotification({
            message: message,
            status: NotificationStatusEnum.SUCCESS,
          });
        }),
        takeUntil(this.destroy$),
        catchError(err => {
          this.notificationService.setNotificationLoader(false);
          this.errorMessage = err.code;
          //so that the red circle has time to load
          this.verification = false;
          this.codeWhichWrittenUserWasEqualFromEmail = true;
          const messageKey = 'message.somethingWentWrong';
          const message = this.translateService.instant(messageKey);
          this.notificationService.sendNotification({
            message: message,
            status: NotificationStatusEnum.ERROR,
          });
          return EMPTY;
        })
      );
  }

  afterVerify(): void {
    if (this.errorMessage) {
      this.clearSettingsForRedrawing();
      this.registerForm.reset();
      this.router.navigate(['/signup']).then(() => {});
    } else {
      this.router.navigate(['/']).then(() => {});
    }
  }

  clearSettingsForRedrawing(): void {
    this.errorMessage = null;
    this.infoFromUser = null;
    this.verification = false;
    this.codeWhichWrittenUserWasEqualFromEmail = false;
  }
}
