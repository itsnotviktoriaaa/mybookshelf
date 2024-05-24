import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ThemeI } from 'app/modals';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _themes: ThemeI = {
    light: {
      '--white-color': '#fff',
      '--main-light-color': '#f3f3f7',
      '--black-color': '#000',
      '--primary-gray-text-color': '#8a8a8a',
      '--primary-gray-color': '#a9a9a9',
      '--primary-light-gray-color': '#d6d6d6',
      '--gray-label-color': '#4d4d4d',
      '--gray-text-color': '#747373',
      '--primary-orange-color': '#e36e48',
      '--primary-orange-color-hover': '#d26442',
      '--secondary-orange-color': '#f27851',
      '--orange-button-color': '#f76b56',
      '--primary-dark-gray-color': '#2f2f2f',
      '--dark-gray-title-color': '#333',
      '--primary-star': '#ffcb45',
      '--green-bottom-color': '#41b64d',
      '--green-bottom-color-hover': '#359f3d',
    },
    dark: {
      '--white-color': '#2c2c2c',
      '--main-light-color': '#4e4e4e',
      '--black-color': '#fff',
      '--primary-gray-text-color': '#d6d6d6',
      '--primary-gray-color': '#a9a9a9',
      '--primary-light-gray-color': '#4e4e4e',
      '--gray-label-color': '#878787',
      '--gray-text-color': '#b3b3b3',
      '--primary-orange-color': '#d26442',
      '--primary-orange-color-hover': '#e36e48',
      '--secondary-orange-color': '#f27851',
      '--orange-button-color': '#f76b56',
      '--primary-dark-gray-color': '#cdcdcd',
      '--dark-gray-title-color': '#aaaaaa',
      '--primary-star': '#ffcb45',
      '--green-bottom-color': '#359f3d',
      '--green-bottom-color-hover': '#41b64d',
    },
  };

  _changeTheme$ = new Subject<string>();

  changeTheme$(): Observable<string> {
    return this._changeTheme$.asObservable();
  }

  setThemeSubject(theme: string): void {
    this._changeTheme$.next(theme);
  }

  setTheme(themeName: string): void {
    const theme = this._themes[themeName];

    if (theme) {
      Object.keys(theme).forEach((key: string): void => {
        document.documentElement.style.setProperty(key, theme[key]);
      });
    }

    this._changeTheme$.next(themeName);
  }
}
