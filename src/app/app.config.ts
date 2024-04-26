import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { AuthorEffects } from './ngrx/author/author.effects';
import { authorReducer } from './ngrx/author/author.reducer';
import { DetailBookEffects } from './ngrx/detail-book/detail-book.effects';
import { detailReducer } from './ngrx/detail-book/detail-book.reducer';
import { FavoritesEffects } from './ngrx/favorites/favorites.effects';
import { favoritesReducer } from './ngrx/favorites/favorites.reducer';
import { BookEffects } from './ngrx/home/home.effects';
import { homeNowReducer, homeReducer } from './ngrx/home/home.reducer';
import { SearchLiveEffects } from './ngrx/search-live/search-live.effects';
import { searchLiveReducer } from './ngrx/search-live/search-live.reducer';
import { SearchEffects } from './ngrx/search/search.effects';
import { searchReducer } from './ngrx/search/search.reducer';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAngularSvgIcon } from 'angular-svg-icon';

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
    provideStore({
      home: homeReducer,
      homeNow: homeNowReducer,
      favorites: favoritesReducer,
      detailBook: detailReducer,
      author: authorReducer,
      search: searchReducer,
      searchLive: searchLiveReducer,
    }),
    provideEffects([
      BookEffects,
      FavoritesEffects,
      DetailBookEffects,
      AuthorEffects,
      SearchEffects,
      SearchLiveEffects,
    ]),
  ],
};
