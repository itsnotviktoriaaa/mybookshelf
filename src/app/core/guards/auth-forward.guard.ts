import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { catchError, from, of, switchMap } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { inject } from '@angular/core';

export const authForwardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router: Router = inject(Router);
  const oAuthService: OAuthService = inject(OAuthService);
  oAuthService.configure(environment.oAuthConfig);

  if (state.url === '/' || state.url === '/signup') {
    return from(oAuthService.loadDiscoveryDocument()).pipe(
      switchMap(() => oAuthService.tryLoginImplicitFlow()),
      switchMap(() => {
        if (!oAuthService.hasValidAccessToken()) {
          return of(true);
        } else {
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
          return of(true);
        }
      }),
      catchError(() => {
        return of(router.createUrlTree(['/']));
      })
    );
  }

  return of(true);
};
