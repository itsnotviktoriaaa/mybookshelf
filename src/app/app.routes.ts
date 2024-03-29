import { Routes } from '@angular/router';
import { LoginComponent } from './views';
import { SignupComponent } from './views';
import { LayoutComponent } from './shared';
import { authForwardGuard } from './core/auth/auth-forward.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login in MyBookShelf', component: LoginComponent, canActivate: [authForwardGuard] },
  {
    path: 'signup',
    title: 'Signup in MyBookShelf',
    component: SignupComponent,
    canActivate: [authForwardGuard],
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [authForwardGuard],
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
