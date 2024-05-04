import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IMenuBelowBar, IMenuItem } from '../../../modals/user';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent implements AfterViewInit {
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  @ViewChild('close') close: ElementRef | null = null;

  constructor(private router: Router) {}

  menuItems: IMenuItem[] = [
    { routerLink: '/home', icon: '/bar-home.svg', text: 'Home' },
    { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Search' },
    { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Favorites' },
    { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'My Books' },
    { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Upload' },
  ];

  menuBelowBarItems: IMenuBelowBar[] = [
    { routerLink: '/home/about', text: 'About' },
    { routerLink: '/home/support', text: 'Support' },
    { routerLink: '/home/terms', text: 'Terms & Condition' },
  ];

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
}
