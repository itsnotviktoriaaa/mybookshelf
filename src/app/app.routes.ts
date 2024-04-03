import { Routes } from '@angular/router';
import { LoginComponent } from './views';
import { SignupComponent } from './views';
import { LayoutComponent } from './shared';
import { authForwardGuard } from './core/auth/auth-forward.guard';

export const routes: Routes = [
  { path: '', title: 'Login in MyBookShelf', component: LoginComponent, canActivate: [authForwardGuard] },
  // { path: 'login', title: 'Login in MyBookShelf', component: LoginComponent },
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
        loadComponent: () => import('./views/user/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'show',
        title: 'MyBookShelf',
        loadComponent: () => import('./views/user/show-all/show-all.component').then(m => m.ShowAllComponent),
      },
      // {
      //   path: 'book/:url',
      //   title: 'MyBookShelf',
      //   loadComponent: () => import('./views/user/home/home.component').then(m => m.HomeComponent),
      // },
    ],
  },
  { path: '**', redirectTo: '/' },
];
