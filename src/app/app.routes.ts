import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from 'app/views/auth';
import { authForwardGuard, LayoutComponent } from 'app/shared';

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
        loadComponent: () => import('app/views/').then(c => c.HomeComponent),
      },
      {
        path: 'show',
        title: 'MyBookShelf',
        loadComponent: () => import('app/views/').then(c => c.ShowAllComponent),
      },
      {
        path: 'favorites',
        title: 'MyBookShelf',
        loadComponent: () => import('app/views/').then(c => c.FavoritesComponent),
      },
      {
        path: 'book/:id',
        title: 'MyBookShelf',
        loadComponent: () => import('app/views/').then(c => c.DetailBookComponent),
      },
      {
        path: 'upload',
        title: 'MyBookShelf',
        loadComponent: () => import('app/views/').then(c => c.UploadComponent),
      },
      {
        path: 'search',
        title: 'MyBookShelf',
        loadComponent: () => import('app/views/').then(c => c.SearchComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
