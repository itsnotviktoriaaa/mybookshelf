import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BarComponent } from './bar/bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, BarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
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
          width: 100%;
          border-radius: 0 10px 0 0;
        }
      }
    `,
  ],
})
export class LayoutComponent {}
