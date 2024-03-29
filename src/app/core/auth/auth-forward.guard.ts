import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';
type User = import('firebase/auth').User;

export const authForwardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.user$.pipe(
    map((user: User | null) => {
      const isExistUserName: string | null | undefined = user?.displayName;
      if (state.url === '/login' && isExistUserName) {
        return router.createUrlTree(['/home']);
      } else if (state.url === '/login' && !isExistUserName) {
        return true;
      }

      if (state.url === '/signup' && isExistUserName) {
        return router.createUrlTree(['/home']);
      } else if (state.url === '/signup' && !isExistUserName) {
        return true;
      }

      if (state.url === '/home' && isExistUserName) {
        return true;
      } else if (state.url === '/home' && !isExistUserName) {
        return router.createUrlTree(['/login']);
      }

      return true;
    }),
    catchError(err => {
      console.log(err);
      //тут лучше потом на типо 404
      return of(router.createUrlTree(['/']));
    })
  );
};
