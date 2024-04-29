import { selectCurrentUser } from './auth-firebase.selector';
import { setUserAction } from './auth-firebase.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseFacade {
  constructor(private store: Store) {}

  setUser(user: string | null): void {
    this.store.dispatch(setUserAction({ user }));
  }

  getCurrentUser(): Observable<string | null> {
    return this.store.select(selectCurrentUser);
  }
}
