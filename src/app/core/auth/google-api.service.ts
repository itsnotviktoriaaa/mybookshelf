import { IActiveParamsSearch, IBook, IDetailBook, ISearchInfoDetail } from 'models/';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { IUserInfoFromGoogle } from 'models/';
import { Injectable } from '@angular/core';
import { ActiveParamUtil } from '../utils';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  userProfileSubject = new BehaviorSubject<IUserInfoFromGoogle | null>(null);
  constructor(
    private readonly oAuthService: OAuthService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  initiateAuthentication(): void {
    this.oAuthService.configure(environment.oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService
            .loadUserProfile()
            .then(userProfile => {
              this.oAuthService.tokenValidationHandler = new JwksValidationHandler();

              // this.oAuthService.events.subscribe(event => {
              //   if (event.type === 'token_received') {
              //     console.log('Automatic token refresh event received:', event);
              //   }
              // });

              this.oAuthService.setupAutomaticSilentRefresh({
                login_hint: (userProfile as IUserInfoFromGoogle)['info']['email'],
              });

              this.userProfileSubject.next(userProfile as IUserInfoFromGoogle);
              this.authService
                .checkEmailWasUsed(this.userProfileSubject.getValue()!.info.email)
                .pipe(
                  tap((param: string[]) => {
                    if (param && param.length > 0) {
                      this.authService.login(
                        this.userProfileSubject.getValue()!.info.email,
                        this.userProfileSubject.getValue()!.info.sub
                      );
                    } else {
                      this.authService.register(
                        this.userProfileSubject.getValue()!.info.email,
                        this.userProfileSubject.getValue()!.info.name,
                        (userProfile as IUserInfoFromGoogle).info.sub
                      );
                    }
                  })
                )
                .subscribe();
            })
            .catch(() => {
              this.router.navigate(['/']).then((): void => {});
            });
        }
      });
    });
  }

  getReadingNow(startIndex: number): Observable<IBook> {
    return this.http.get<IBook>(`${environment.googleLibraryApi}3/volumes`, {
      params: this.authParams(startIndex),
      headers: this.authHeader(),
    });
  }

  getFavorites(params: IActiveParamsSearch): Observable<IBook> {
    let queryString: string = `maxResults=${params.maxResults}&startIndex=${params.startIndex}`;

    if (params.q) {
      queryString = `q=${params.q}&` + queryString;
    }

    return this.http.get<IBook>(`${environment.googleLibraryApi}0/volumes?${queryString}`, {
      headers: this.authHeader(),
    });
  }

  getRecommended(startIndex: number): Observable<IBook> {
    return this.http.get<IBook>(`${environment.googleLibraryApi}8/volumes`, {
      params: this.authParams(startIndex),
      headers: this.authHeader(),
    });
  }

  getDetailBook(idOfBook: string): Observable<IDetailBook> {
    return this.http.get<IDetailBook>(`${environment.googleVolumeApi}/${idOfBook}`, {
      headers: this.authHeader(),
    });
  }

  getAuthorDetail(author: string): Observable<ISearchInfoDetail> {
    return this.http.get<ISearchInfoDetail>(
      `${environment.googleVolumeApi}?q=inauthor:${author}&maxResults=3`
    );
  }

  getSearchBooksDefault(params: IActiveParamsSearch): Observable<ISearchInfoDetail> {
    const queryString: string = `q=${params.q}&maxResults=${params.maxResults}&startIndex=${params.startIndex}`;

    return this.http.get<ISearchInfoDetail>(`${environment.googleVolumeApi}?${queryString}`);
  }

  getSearchBooksLive(textFromInput: string, typeFromInput: string): Observable<ISearchInfoDetail> {
    const typeTransformed: string = ActiveParamUtil.processTypeForLive(typeFromInput);
    const queryString: string = `q=${typeTransformed}${textFromInput}`;
    return this.http.get<ISearchInfoDetail>(`${environment.googleVolumeApi}?${queryString}`);
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
