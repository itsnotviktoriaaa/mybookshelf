import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login in MyBookShelf', component: LoginComponent },
  {
    path: 'signup',
    title: 'Signup in MyBookShelf',
    component: SignupComponent,
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: '',
        title: 'MyBookShelf',
        loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
