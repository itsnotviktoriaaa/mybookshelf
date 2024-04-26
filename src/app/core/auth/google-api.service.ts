import {
  ActiveParamsSearchType,
  BookInterface,
  DetailBookInterface,
  SearchInfoDetail,
} from '../../modals/user';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserInfoFromGoogle } from '../../modals/auth';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActiveParamUtil } from '../utils';
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
    this.oAuthService.configure(environment.oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then(userProfile => {
            this.oAuthService.setupAutomaticSilentRefresh();
            // console.log(this.oAuthService.getAccessToken());
            // console.log(JSON.stringify(userProfile));
            this.userProfileSubject.next(userProfile as UserInfoFromGoogle);
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

  getReadingNow(startIndex: number): Observable<BookInterface> {
    return this.http.get<BookInterface>(`${environment.googleLibraryApi}3/volumes`, {
      params: this.authParams(startIndex),
      headers: this.authHeader(),
    });
  }

  getFavorites(params: ActiveParamsSearchType): Observable<BookInterface> {
    let queryString: string = `maxResults=${params.maxResults}&startIndex=${params.startIndex}`;

    if (params.q) {
      queryString = `q=${params.q}&` + queryString;
    }

    return this.http.get<BookInterface>(`${environment.googleLibraryApi}0/volumes?${queryString}`, {
      headers: this.authHeader(),
    });
  }

  getRecommended(startIndex: number): Observable<BookInterface> {
    return this.http.get<BookInterface>(`${environment.googleLibraryApi}8/volumes`, {
      params: this.authParams(startIndex),
      headers: this.authHeader(),
    });
  }

  getDetailBook(idOfBook: string): Observable<DetailBookInterface> {
    return this.http.get<DetailBookInterface>(`${environment.googleVolumeApi}/${idOfBook}`, {
      headers: this.authHeader(),
    });
  }
  getAuthorDetail(author: string): Observable<SearchInfoDetail> {
    return this.http.get<SearchInfoDetail>(
      `${environment.googleVolumeApi}?q=inauthor:${author}&maxResults=2`
    );
  }
  getSearchBooksDefault(params: ActiveParamsSearchType): Observable<SearchInfoDetail> {
    const queryString: string = `q=${params.q}&maxResults=${params.maxResults}&startIndex=${params.startIndex}`;

    return this.http.get<SearchInfoDetail>(`${environment.googleVolumeApi}?${queryString}`);
  }

  getSearchBooksLive(textFromInput: string, typeFromInput: string): Observable<SearchInfoDetail> {
    const typeTransformed: string = ActiveParamUtil.processTypeForLive(typeFromInput);
    const queryString: string = `q=${typeTransformed}${textFromInput}`;
    return this.http.get<SearchInfoDetail>(`${environment.googleVolumeApi}?${queryString}`);
  }

  setFavoriteBook(id: string): Observable<NonNullable<unknown>> {
    return this.http.post(
      `${environment.googleLibraryApi}0/addVolume?volumeId=${id}`,
      {},
      { headers: this.authHeader() }
    );
  }

  removeFavoriteBook(id: string): Observable<NonNullable<unknown>> {
    return this.http.post(
      `${environment.googleLibraryApi}0/removeVolume?volumeId=${id}`,
      {},
      { headers: this.authHeader() }
    );
  }

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

  private authParams(startIndex: number): HttpParams {
    return new HttpParams().set('maxResults', 40).set('startIndex', startIndex);
  }
}
