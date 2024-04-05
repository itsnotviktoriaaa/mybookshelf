import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { oAuthConfig } from './auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, from, of, switchMap } from 'rxjs';

export const authForwardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router: Router = inject(Router);
  const oAuthService: OAuthService = inject(OAuthService);
  oAuthService.configure(oAuthConfig);
  oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';

  if (state.url === '/' || state.url === '/signup') {
    return from(oAuthService.loadDiscoveryDocument()).pipe(
      switchMap(() => oAuthService.tryLoginImplicitFlow()),
      switchMap(() => {
        if (!oAuthService.hasValidAccessToken()) {
          console.log('мы тут');
          return of(true);
        } else {
          console.log('jjjejeje');
          return of(router.createUrlTree(['/home']));
        }
      })
    );
  } else if (state.url === '/home') {
    return from(oAuthService.loadDiscoveryDocument()).pipe(
      switchMap(() => oAuthService.tryLoginImplicitFlow()),
      switchMap(() => {
        if (!oAuthService.hasValidAccessToken()) {
          return of(router.createUrlTree(['/']));
        } else {
          return of(true);
        }
      }),
      catchError(err => {
        console.log(err);
        return of(router.createUrlTree(['/']));
      })
    );
  }

  return of(true);

  //было сделано до того как сделала регистрацию через Google OAuth

  // return authService.user$.pipe(
  //   map((user: User | null) => {
  //     const isExistUserName: string | null | undefined = user?.displayName;
  //     if (state.url === '/login' && isExistUserName) {
  //       return router.createUrlTree(['/home']);
  //     } else if (state.url === '/login' && !isExistUserName) {
  //       return true;
  //     }
  //
  //     if (state.url === '/signup' && isExistUserName) {
  //       return router.createUrlTree(['/home']);
  //     } else if (state.url === '/signup' && !isExistUserName) {
  //       return true;
  //     }
  //
  //     if (state.url === '/home' && isExistUserName) {
  //       return true;
  //     } else if (state.url === '/home' && !isExistUserName) {
  //       return router.createUrlTree(['/login']);
  //     }
  //
  //     return true;
  //   }),
  //   catchError(err => {
  //     console.log(err);
  //     //тут лучше потом на типо 404
  //     return of(router.createUrlTree(['/']));
  //   })
  // );
};
