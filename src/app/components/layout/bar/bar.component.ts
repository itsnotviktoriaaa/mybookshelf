import { MenuBelowBarInterface, MenuItemInterface } from '../../../modals/user';
import { environment } from '../../../../environments/environment.development';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;

  menuItems: MenuItemInterface[] = [
    { routerLink: '/home', icon: '/bar-home.svg', text: 'Home' },
    { routerLink: '/home/search', icon: '/bar-search.svg', text: 'Search' },
    { routerLink: '/home/favorites', icon: '/bar-favorites.svg', text: 'Favorites' },
    { routerLink: '/home/books', icon: '/bar-favorites.svg', text: 'My Books' },
    { routerLink: '/home/upload', icon: '/bar-upload.svg', text: 'Upload' },
  ];

  menuBelowBarItems: MenuBelowBarInterface[] = [
    { routerLink: '/home/about', text: 'About' },
    { routerLink: '/home/support', text: 'Support' },
    { routerLink: '/home/terms', text: 'Terms & Condition' },
  ];
}
