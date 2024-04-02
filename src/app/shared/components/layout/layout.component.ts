import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BarComponent } from './bar/bar.component';
import { RouterOutlet } from '@angular/router';
import { GoogleApiService, UserInfoFromGoogle } from '../../../core/auth/google-api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, BarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .layout-wrapper {
        padding: 48px 35px 38px 35px;
        background-image: url('/assets/images/layout/layout-background.webp');
        background-size: cover;
        background-repeat: no-repeat;

        .layout {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .main-content-wrapper {
          background-color: #f3f3f7;
          width: 100vw;
          border-radius: 0 10px 0 0;
          overflow-x: hidden;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  constructor(private googleApi: GoogleApiService) {
    this.googleApi.userProfileSubject
      .pipe(
        tap((user: UserInfoFromGoogle | null) => {
          if (!user) {
            this.googleApi.initiateAuthentication();
          }
        })
      )
      .subscribe();
  }
}
