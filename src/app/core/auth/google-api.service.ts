import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BookInterface } from '../../../types/user/book.interface';
import { oAuthConfig } from '../../../types';

export interface UserInfoFromGoogle {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  books: string = 'https://www.googleapis.com/books/v1';
  userProfileSubject = new BehaviorSubject<UserInfoFromGoogle | null>(null);
  constructor(
    private readonly oAuthService: OAuthService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  initiateAuthentication(): void {
    console.log('here');
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then(userProfile => {
            console.log(JSON.stringify(userProfile));
            console.log(this.oAuthService.getAccessToken());
            console.log(JSON.stringify(userProfile));
            this.userProfileSubject.next(userProfile as UserInfoFromGoogle);
            this.authService
              .checkEmailWasUsed((userProfile as UserInfoFromGoogle).info.email)
              .pipe(
                tap((param: string[]) => {
                  if (param && param.length > 0) {
                    console.log('here we are');
                    this.authService.login((userProfile as UserInfoFromGoogle).info.email, (userProfile as UserInfoFromGoogle).info.sub);
                  } else {
                    this.authService.register((userProfile as UserInfoFromGoogle).info.email, (userProfile as UserInfoFromGoogle).info.name, (userProfile as UserInfoFromGoogle).info.sub);
                  }
                })
              )
              .subscribe();
          });
        }
      });
    });
  }

  // getBooks(): Observable<BookInterface> {
  //   return this.http.get<BookInterface>(`https://www.googleapis.com/books/v1/mylibrary/bookshelves`, { headers: this.authHeader() });
  // }

  getReadingNow(): Observable<BookInterface> {
    return this.http.get<BookInterface>(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/3/volumes`, { headers: this.authHeader() });
  }

  // getFavorites(): Observable<BookInterface> {
  //   return this.http.get<BookInterface>(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes`, { headers: this.authHeader() });
  // }

  getRecommended(): Observable<BookInterface> {
    return this.http.get<BookInterface>(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/8/volumes`, { headers: this.authHeader() });
  }

  // setFavoriteBook(): Observable<any> {
  //   return this.http.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/addVolume?volumeId=NRWlitmahXkC`, {}, { headers: this.authHeader() });
  // }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut(): void {
    this.oAuthService.logOut();
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json',
    });
  }
}
