import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../../../types/user.interface';
type User = import('firebase/auth').User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth: Auth = inject(Auth);

  //подписываемся на пользоват-е данные через поток; вернет пользовательские данные (если вошли в систему) либо null;
  user$: Observable<User | null> = user(this.firebaseAuth);

  //не хочу использовать user$, так как там очень много данных и методов, поэтому создаю свой собственный текущий пользовательский сигнал
  currentUserSig: WritableSignal<UserInterface | null | undefined> = signal<UserInterface | null | undefined>(undefined);

  register(email: string, username: string, password: string): Observable<void> {
    const promise: Promise<void> = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(response => updateProfile(response.user, { displayName: username }));
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise: Promise<void> = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise: Promise<void> = signOut(this.firebaseAuth);
    return from(promise);
  }

  //потом применить для выхода, когда будет создана кнопка для выхода из системы
  // logout(): void {
  //   this.authService.logout();
  // };
}
