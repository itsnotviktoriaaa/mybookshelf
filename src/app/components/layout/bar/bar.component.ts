import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Router, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { IMenuBelowBar, IMenuItem } from 'models/';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';
import { ThemeService } from 'app/core';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [RouterLinkActive, SvgIconComponent, AsyncPipe],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements OnInit, AfterViewInit {
  isSwitchOn = false;
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  @ViewChild('close') close: ElementRef | null = null;

  menuItems$: BehaviorSubject<IMenuItem[]> = new BehaviorSubject([
    { routerLink: '/home', icon: '/bar-home.svg', text: 'Home' },
    { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Search' },
    { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Favorites' },
    { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'My Books' },
    { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Upload' },
  ]);

  menuBelowBarItems: IMenuBelowBar[] = [
    { routerLink: '/home/about', text: 'About' },
    { routerLink: '/home/support', text: 'Support' },
    { routerLink: '/home/terms', text: 'Terms & Condition' },
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {
    const browserLang: string | undefined = this.translateService.currentLang;
    if (browserLang === 'ru') {
      this.menuItems$.next([
        { routerLink: '/home', icon: '/bar-home.svg', text: 'Главная' },
        { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Искать' },
        { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Избранное' },
        { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'Мои Книги' },
        { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Загрузить' },
      ]);

      this.menuBelowBarItems = [
        { routerLink: '/home/about', text: 'О нас' },
        { routerLink: '/home/support', text: 'Поддержка' },
        { routerLink: '/home/terms', text: 'Правила и Условия' },
      ];
    } else if (browserLang === 'en') {
      this.menuItems$.next([
        { routerLink: '/home', icon: '/bar-home.svg', text: 'Home' },
        { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Search' },
        { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Favorites' },
        { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'My Books' },
        { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Upload' },
      ]);

      this.menuBelowBarItems = [
        { routerLink: '/home/about', text: 'About' },
        { routerLink: '/home/support', text: 'Support' },
        { routerLink: '/home/terms', text: 'Terms & Condition' },
      ];
    }
  }

  ngOnInit(): void {
    this.translateService.onLangChange
      .pipe(
        tap((lang: LangChangeEvent): void => {
          console.log(lang.lang);
          if (lang.lang === 'en') {
            this.menuItems$.next([
              { routerLink: '/home', icon: '/bar-home.svg', text: 'Home' },
              { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Search' },
              { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Favorites' },
              { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'My Books' },
              { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Upload' },
            ]);

            this.menuBelowBarItems = [
              { routerLink: '/home/about', text: 'About' },
              { routerLink: '/home/support', text: 'Support' },
              { routerLink: '/home/terms', text: 'Terms & Condition' },
            ];
          } else if (lang.lang === 'ru') {
            this.menuItems$.next([
              { routerLink: '/home', icon: '/bar-home.svg', text: 'Главная' },
              { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Искать' },
              { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Избранное' },
              { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'Мои Книги' },
              { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Загрузить' },
            ]);

            this.menuBelowBarItems = [
              { routerLink: '/home/about', text: 'О нас' },
              { routerLink: '/home/support', text: 'Поддержка' },
              { routerLink: '/home/terms', text: 'Правила и Условия' },
            ];
          }
        })
      )
      .subscribe();
  }

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
