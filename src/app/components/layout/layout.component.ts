import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { GoogleApiService, ThemeService } from 'app/core';
import { BarComponent } from './bar/bar.component';
import { IUserInfoFromGoogle } from 'app/models';
import { RouterOutlet } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, BarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      @import '../../../assets/styles/color';
      .layout-wrapper {
        padding: 48px 35px 38px 35px;
        background-image: url('/assets/images/layout/layout-background-light.webp');
        background-size: cover;
        background-repeat: no-repeat;
        height: 100vh;

        .layout {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background-color: var(--main-light-color);
          border-radius: 10px;
          height: calc(100vh - 108px);
        }

        .main-content-wrapper {
          flex: 1;
          border-radius: 0 10px 0 0;
          overflow-x: hidden;
          overflow-y: hidden;
        }
      }

      @media screen and (max-width: 835px) {
        .layout-wrapper {
          padding: 10px;

          .layout {
            height: calc(100vh - 20px);
          }
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  isDarkTheme = false;
  @ViewChild('layoutWrapper') layoutWrapper: ElementRef | null = null;

  constructor(
    private googleApi: GoogleApiService,
    private themeService: ThemeService
  ) {
    this.googleApi.userProfileSubject
      .pipe(
        tap((user: IUserInfoFromGoogle | null) => {
          if (!user) {
            this.googleApi.initiateAuthentication();
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.themeService
      .changeTheme$()
      .pipe(
        tap((theme: string): void => {
          if (this.layoutWrapper && this.layoutWrapper.nativeElement) {
            if (theme === 'dark') {
              this.layoutWrapper.nativeElement.style.backgroundImage =
                'url(/assets/images/layout/layout-background-dark.webp)';
            } else if (theme === 'light') {
              this.layoutWrapper.nativeElement.style.backgroundImage =
                'url(/assets/images/layout/layout-background-light.webp)';
            }
          }
        })
      )
      .subscribe();
  }
}
