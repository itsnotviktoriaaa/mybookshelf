import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthorInfoDetail, BookInterface, DetailBookInterface } from '../../types/user';
import { oAuthConfig } from '../../config';
import { UserInfoFromGoogle } from '../../types/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  userProfileSubject: BehaviorSubject<UserInfoFromGoogle | null> =
    new BehaviorSubject<UserInfoFromGoogle | null>(null);
  constructor(
    private readonly oAuthService: OAuthService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  initiateAuthentication(): void {
    console.log('here');
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then(userProfile => {
            // console.log(JSON.stringify(userProfile));
            // console.log(this.oAuthService.getAccessToken());
            this.userProfileSubject.next(userProfile as UserInfoFromGoogle);
            this.oAuthService.setupAutomaticSilentRefresh();
            this.authService
              .checkEmailWasUsed(this.userProfileSubject.getValue()!.info.email)
              .pipe(
                tap((param: string[]) => {
                  if (param && param.length > 0) {
                    console.log('here we are');
                    this.authService.login(
                      this.userProfileSubject.getValue()!.info.email,
                      this.userProfileSubject.getValue()!.info.sub
                    );
                  } else {
                    this.authService.register(
                      this.userProfileSubject.getValue()!.info.email,
                      this.userProfileSubject.getValue()!.info.name,
                      (userProfile as UserInfoFromGoogle).info.sub
                    );
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

  getReadingNow(startIndex: number): Observable<BookInterface> {
    const params = new HttpParams().set('maxResults', 40).set('startIndex', startIndex);
    return this.http.get<BookInterface>(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/3/volumes`,
      {
        params: params,
        headers: this.authHeader(),
      }
    );
  }

  getFavorites(): Observable<BookInterface> {
    return this.http.get<BookInterface>(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes`,
      { headers: this.authHeader() }
    );
  }

  getRecommended(startIndex: number): Observable<BookInterface> {
    const params = new HttpParams().set('maxResults', 40).set('startIndex', startIndex);
    return this.http.get<BookInterface>(
      `https://www.googleapis.com/books/v1/mylibrary/bookshelves/8/volumes`,
      {
        params: params,
        headers: this.authHeader(),
      }
    );
  }

  getDetailBook(idOfBook: string): Observable<DetailBookInterface> {
    return this.http.get<DetailBookInterface>(
      `https://www.googleapis.com/books/v1/volumes/${idOfBook}`,
      { headers: this.authHeader() }
    );
  }
  getAuthorDetail(author: string): Observable<AuthorInfoDetail> {
    return this.http.get<AuthorInfoDetail>(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=2`
    );
  }

  // setFavoriteBook(): Observable<any> {
  //   return this.http.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/addVolume?volumeId=NRWlitmahXkC`, {}, { headers: this.authHeader() });
  // }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut(): void {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      this.oAuthService.logOut();
      this.router.navigate(['/']);
    });
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json',
    });
  }
}
