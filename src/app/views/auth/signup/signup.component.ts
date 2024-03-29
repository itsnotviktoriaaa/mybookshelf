import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService, PasswordNotEmailDirective, PasswordRepeatDirective } from '../../../shared';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthModule } from '@angular/fire/auth';
import { AuthService } from '../../../core';
import emailJs, { EmailJSResponseStatus } from '@emailjs/browser';
import { of, Subject, Subscription } from 'rxjs';
import { NotificationStatus, UserSignInterface } from '../../../../types';
import { Constants } from '../../../shared/constants';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, FormsModule, ReactiveFormsModule, NgStyle, PasswordRepeatDirective, PasswordNotEmailDirective, AngularFireAuthModule, AuthModule, NgClass, SvgIconComponent],
})
export class SignupComponent implements OnInit, OnDestroy {
  registerForm: FormGroup | null = null;
  fb: FormBuilder = inject(FormBuilder);
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;
  errorMessage: string | null = null;
  infoFromUser: UserSignInterface | null = null;
  verification: boolean = false;
  verification$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('verificationBody') verificationBody: ElementRef | null = null;
  fillAllInputs: boolean = false;
  generatedCode: number | null = null;
  codeWhichWriteUser: string = '';
  codeWhichWrittenUserWasEqualFromEmail: boolean = false;
  verification1: Subscription | null = null;
  subscription2: Subscription | null = null;
  subscription3: Subscription | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(Constants.regularForPassword)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.verification1 = this.verification$.subscribe((params: boolean): void => {
      setTimeout(() => {
        if (params) {
          this.handleAllInputsForCode();
        }
      }, 0);
    });
  }

  checkEmailWasUsedBeforeToSendCode(): void {
    console.log(this.registerForm?.value.email);
    this.subscription2 = this.authService.checkEmailWasUsed(this.registerForm?.value.email).subscribe({
      next: (param: Array<string>): void => {
        if (param && param.length === 0) {
          this.sendCodeToEmail().then(() => {});
        } else {
          this.notificationService.notifyAboutNotification({ message: 'Your email address has been used before', status: NotificationStatus.error });
        }
      },
      error: (err): void => {
        this.notificationService.notifyAboutNotification({ message: 'Something went wrong. Please, try again', status: NotificationStatus.error });
        console.log(err);
      },
    });
  }

  handleAllInputsForCode(): void {
    if (this.verificationBody && this.verificationBody.nativeElement && this.verification) {
      const verificationInputs = this.verificationBody.nativeElement.querySelectorAll('.verification-number');

      for (let i: number = 0; i < verificationInputs.length; i++) {
        console.log('handle inputs');

        verificationInputs[i].addEventListener('keyup', (event: KeyboardEvent): void => {
          const currentValue: string = (event.target as HTMLInputElement)?.value;
          const currentCode: string = event.code;

          if (currentCode && currentCode === 'Backspace' && i !== 0) {
            verificationInputs[i - 1].focus();
          } else if (currentValue && currentValue.length === 1 && i < verificationInputs.length - 1) {
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

    //эта строчка верхняя вот такая, которая снизу
    // if (!regExForInputWhenUserBuyCoins.test(event.key) && event.code !== 'Backspace') return false;
    // else {
    //   return true;
    // }
  }

  changeShowingPassword(nameOfInput: string): void {
    this.isShowPassword = nameOfInput === 'isShowPassword' ? !this.isShowPassword : this.isShowPassword;
    this.isShowConfirmPassword = nameOfInput === 'isShowConfirmPassword' ? !this.isShowConfirmPassword : this.isShowConfirmPassword;
  }

  checkInputsForAbleButton(verificationInputs: NodeListOf<HTMLInputElement>): void {
    console.log(verificationInputs);
    this.fillAllInputs = Array.from(verificationInputs).every((input: HTMLInputElement): boolean => {
      return input.value !== '';
    });

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
      this.notificationService.notifyAboutNotification({ message: 'Incorrect code, try entering the code again', status: NotificationStatus.error });
    }
  }

  async sendCodeToEmail(): Promise<void> {
    this.notificationService.notifyAboutNotificationLoader(true);
    if (!this.infoFromUser) {
      this.infoFromUser = {
        email: this.registerForm?.value.email,
        username: this.registerForm?.value.username,
        password: this.registerForm?.value.password,
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

    of(response).subscribe({
      next: (response: EmailJSResponseStatus): void => {
        this.notificationService.notifyAboutNotificationLoader(false);
        console.log('Success. Status: ' + response.text + ' ' + response.status);
        this.notificationService.notifyAboutNotification({ message: 'Code was sent on your email. Please, check and enter values', status: NotificationStatus.success });

        if (!this.verification) {
          this.verification = true;
          this.verification$.next(true);
        }
      },
      error: (error): void => {
        this.notificationService.notifyAboutNotificationLoader(false);
        this.notificationService.notifyAboutNotification({ message: 'Something went wrong. Please, try again', status: NotificationStatus.error });
        console.log('sth went wrong. Error ' + error.text + ' ' + error.status);
      },
    });
  }

  backToRegister(): void {
    this.verification = false;
    this.registerForm?.reset();
    this.errorMessage = null;
    this.router.navigate(['/signup']).then(() => {});
  }

  sign(): void {
    this.notificationService.notifyAboutNotificationLoader(true);
    this.subscription3 = this.authService.register(this.infoFromUser!.email, this.infoFromUser!.username, this.infoFromUser!.password).subscribe({
      next: (): void => {
        this.notificationService.notifyAboutNotificationLoader(false);
        this.verification = false;
        this.codeWhichWrittenUserWasEqualFromEmail = true;
        this.notificationService.notifyAboutNotification({ message: 'You have successfully registered', status: NotificationStatus.success });
      },
      error: (err): void => {
        this.notificationService.notifyAboutNotificationLoader(false);
        this.errorMessage = err.code;
        //so that the red circle has time to load
        this.verification = false;
        this.codeWhichWrittenUserWasEqualFromEmail = true;
        this.notificationService.notifyAboutNotification({ message: `Something went wrong:( Please, try again`, status: NotificationStatus.error });
      },
    });
  }

  afterVerify(): void {
    if (this.errorMessage) {
      this.clearSettingsForRedrawing();
      this.registerForm?.reset();
      this.router.navigate(['/signup']).then(() => {});
    } else {
      this.router.navigate(['/login']).then(() => {});
    }
  }

  clearSettingsForRedrawing(): void {
    this.errorMessage = null;
    this.infoFromUser = null;
    this.verification = false;
    this.codeWhichWrittenUserWasEqualFromEmail = false;
  }

  ngOnDestroy(): void {
    this.verification1?.unsubscribe();
    this.subscription2?.unsubscribe();
    this.subscription3?.unsubscribe();
  }
}
