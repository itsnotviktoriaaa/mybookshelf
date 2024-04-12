import { Routes } from '@angular/router';
import { LoginComponent } from './views';
import { SignupComponent } from './views';
import { LayoutComponent } from './shared/components';
import { authForwardGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: '',
    title: 'Login in MyBookShelf',
    component: LoginComponent,
    canActivate: [authForwardGuard],
  },
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
        pathMatch: 'full',
        loadComponent: () => import('./views/user/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'show',
        title: 'MyBookShelf',
        loadComponent: () =>
          import('./views/user/show-all/show-all.component').then(m => m.ShowAllComponent),
      },
      {
        path: 'favorites',
        title: 'MyBookShelf',
        loadComponent: () =>
          import('./views/user/favorites/favorites.component').then(m => m.FavoritesComponent),
      },
      {
        path: 'book/:id',
        title: 'MyBookShelf',
        loadComponent: () =>
          import('./views/user/detail-book/detail-book.component').then(m => m.DetailBookComponent),
      },
      {
        path: 'upload',
        title: 'MyBookShelf',
        loadComponent: () =>
          import('./views/user/upload/upload.component').then(m => m.UploadComponent),
      },
      {
        path: 'search',
        title: 'MyBookShelf',
        loadComponent: () =>
          import('./views/user/search/search.component').then(m => m.SearchComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
