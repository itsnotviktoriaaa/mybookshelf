import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { oAuthConfig } from '../../config';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, from, of, switchMap } from 'rxjs';

export const authForwardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router: Router = inject(Router);
  const oAuthService: OAuthService = inject(OAuthService);
  oAuthService.configure(oAuthConfig);
  console.log('HIIIII');
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
  } else if (state.url.includes('/home')) {
    return from(oAuthService.loadDiscoveryDocument()).pipe(
      switchMap(() => oAuthService.tryLoginImplicitFlow()),
      switchMap(() => {
        if (!oAuthService.hasValidAccessToken()) {
          return of(router.createUrlTree(['/']));
        } else {
          console.log('WE ARE HEREEE');
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
};
