import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Router, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { IMenuBelowBar, IMenuItem } from 'models/';
import { AsyncPipe } from '@angular/common';
import { ThemeService } from 'app/core';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [RouterLinkActive, SvgIconComponent, AsyncPipe, TranslateModule],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements AfterViewInit {
  isSwitchOn = false;
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  @ViewChild('close') close: ElementRef | null = null;

  menuItems: IMenuItem[] = [
    { routerLink: '/home', icon: '/bar-home.svg', translate: 'bar-menu-above.home' },
    { routerLink: '/home/search', icon: '/bar-search.svg', translate: 'bar-menu-above.search' },
    {
      routerLink: '/home/favorites',
      icon: '/bar-favorites.svg',
      translate: 'bar-menu-above.favorites',
    },
    { routerLink: '/home/books', icon: '/bar-favorites.svg', translate: 'bar-menu-above.myBooks' },
    { routerLink: '/home/upload', icon: '/bar-upload.svg', translate: 'bar-menu-above.upload' },
  ];

  menuBelowBarItems: IMenuBelowBar[] = [
    { routerLink: '/home/about', translate: 'bar-below-below.about' },
    { routerLink: '/home/support', translate: 'bar-below-below.support' },
    { routerLink: '/home/terms', translate: 'bar-below-below.termsAndCondition' },
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngAfterViewInit(): void {
    if (this.close && this.close.nativeElement) {
      this.close.nativeElement.addEventListener('click', (): void => {
        const bar: HTMLElement | null = document.getElementById('bar');
        if (bar) {
          bar.classList.remove('bar-adaptive');
        }
      });
    }
  }

  moveToPage(routerLink: string): void {
    this.router.navigate([routerLink]).then((): void => {});
    const bar: HTMLElement | null = document.getElementById('bar');
    if (bar) {
      bar.classList.remove('bar-adaptive');
    }
  }

  changeTheme(): void {
    this.isSwitchOn = !this.isSwitchOn;
    this.themeService.setTheme(this.isSwitchOn ? 'dark' : 'light');
    if (this.isSwitchOn) {
      this.themeService.setThemeSubject('dark');
    } else {
      this.themeService.setThemeSubject('light');
    }
  }
}
