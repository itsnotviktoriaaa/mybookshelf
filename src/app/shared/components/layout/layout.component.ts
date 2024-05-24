import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { UserInfoFromGoogle } from 'types/';
import { GoogleApiService } from 'core/';
import { tap } from 'rxjs';
import { BarComponent } from './bar/bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [BarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .layout-wrapper {
        padding: 48px 35px 38px 35px;
        background-image: url('/assets/images/layout/layout-background.webp');
        background-size: cover;
        background-repeat: no-repeat;
        height: 100vh;

        .layout {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background-color: #f3f3f7;
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
    `,
  ],
})
export class LayoutComponent {
  constructor(private googleApi: GoogleApiService) {
    this.googleApi.userProfileSubject
      .pipe(
        tap((user: UserInfoFromGoogle | null) => {
          if (!user) {
            console.log('wowowowow');
            this.googleApi.initiateAuthentication();
          }
        })
      )
      .subscribe();
  }
}
