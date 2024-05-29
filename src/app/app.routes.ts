import { LayoutComponent } from 'components/';
import { Routes } from '@angular/router';
import { SignupComponent } from 'views/';
import { authForwardGuard } from 'core/';
import { LoginComponent } from 'views/';

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
        loadComponent: () => import('views/personal-library').then(m => m.HomeComponent),
      },
      {
        path: 'show',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.ShowAllComponent),
      },
      {
        path: 'favorites',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.FavoritesComponent),
      },
      {
        path: 'book/:id',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.DetailBookComponent),
      },
      {
        path: 'upload',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.UploadComponent),
      },
      {
        path: 'books',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.MyBooksComponent),
      },
      {
        path: 'search',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.SearchComponent),
      },
      {
        path: 'reader/:id',
        title: 'MyBookShelf',
        loadComponent: () => import('views/personal-library').then(m => m.PdfViewerComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
