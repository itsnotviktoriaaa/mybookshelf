import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login in MyBookShelf', component: LoginComponent },
  {
    path: 'signup',
    title: 'Signup in MyBookShelf',
    component: SignupComponent,
  },
  { path: '**', redirectTo: '/login' },
];
