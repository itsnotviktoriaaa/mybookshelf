import {
  Auth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IUser } from '../../models/auth';
import { from, Observable } from 'rxjs';
type User = import('firebase/auth').User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth: Auth = inject(Auth);

  //подписываемся на пользоват-е данные через поток; вернет пользовательские данные (если вошли в систему) либо null;
  user$: Observable<User | null> = user(this.firebaseAuth);

  //чтобы не использовать user$, так как там очень много данных и методов, поэтому создаю свой собственный текущий пользовательский сигнал
  currentUserSig: WritableSignal<IUser | null | undefined> = signal<IUser | null | undefined>(
    undefined
  );

  register(email: string, username: string, password: string): Observable<void> {
    const promise: Promise<void> = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => updateProfile(response.user, { displayName: username }));
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise: Promise<void> = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise: Promise<void> = signOut(this.firebaseAuth);
    return from(promise);
  }

  checkEmailWasUsed(email: string): Observable<string[]> {
    const promise: Promise<string[]> = fetchSignInMethodsForEmail(this.firebaseAuth, email);
    return from(promise);
  }

  //это было для использования одноразового входа, но оно не подходит, так как нужен тот же пользователь, а не созданный новый каждый раз
  // signInWithDataFromGoogleOAuth(accessToken: string): void {
  //   signInWithCredential(this.firebaseAuth, GoogleAuthProvider.credential(null, accessToken)).then(res => {
  //     console.log(res);
  //   });
  // }
}
