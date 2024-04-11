import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { homeNowReducer, homeReducer } from 'ngr/';
import { BookEffects } from 'ngr/';
import { favoritesReducer } from 'ngr/';
import { FavoritesEffects } from 'ngr/';
import { DetailBookEffects } from 'ngr/';
import { detailReducer } from 'ngr/';
import { AuthorEffects } from 'ngr/';
import { authorReducer } from 'ngr/';
import { environment } from '../environments/environment.development';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ]),
    provideAngularSvgIcon(),
    provideOAuthClient(),
    provideStore({ home: homeReducer, homeNow: homeNowReducer, favorites: favoritesReducer, detailBook: detailReducer, author: authorReducer }),
    provideEffects([BookEffects, FavoritesEffects, DetailBookEffects, AuthorEffects]),
  ],
};
