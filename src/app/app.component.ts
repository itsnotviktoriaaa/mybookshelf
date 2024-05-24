import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderComponent, NotificationComponent } from 'ui/';
import { Component, inject, OnInit } from '@angular/core';
import { filter, take, takeUntil, tap } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { AuthFirebaseFacade } from 'ngr/';
import { DestroyDirective } from 'core/';
import { AuthService } from 'core/';
type User = import('firebase/auth').User;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, LoaderComponent, TranslateModule],
  hostDirectives: [DestroyDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private authService: AuthService,
    private authFirebaseFacade: AuthFirebaseFacade,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    const browserLang: string | undefined = this.translateService.getBrowserLang();
    if (browserLang === 'en' || browserLang === 'ru') {
      this.translateService.use(browserLang);
    } else {
      this.translateService.use('en');
    }
  }
  ngOnInit(): void {
    this.authService.user$
      .pipe(
        filter(user => Boolean(user)),
        take(1),
        tap((user: User | null) => {
          if (user) {
            const simpleUser: string = user.uid;
            this.authFirebaseFacade.setUser(simpleUser);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
