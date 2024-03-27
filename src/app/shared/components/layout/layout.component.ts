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
      .layout {
        background-image: url('/assets/images/layout/layout-background.webp');
        background-size: cover;
        background-repeat: no-repeat;
        display: flex;
        column-gap: 44px;
        align-items: flex-start;
        justify-content: space-between;
      }
    `,
  ],
})
export class LayoutComponent {}
