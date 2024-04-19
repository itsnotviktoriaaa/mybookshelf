import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { homeNowReducer, homeReducer } from './ngrx/home/home.reducer';
import { BookEffects } from './ngrx/home/home.effects';
import { favoritesReducer } from './ngrx/favorites/favorites.reducer';
import { FavoritesEffects } from './ngrx/favorites/favorites.effects';
import { DetailBookEffects } from './ngrx/detail-book/detail-book.effects';
import { detailReducer } from './ngrx/detail-book/detail-book.reducer';
import { AuthorEffects } from './ngrx/author/author.effects';
import { authorReducer } from './ngrx/author/author.reducer';
import { searchReducer } from './ngrx/search/search.reducer';
import { SearchEffects } from './ngrx/search/search.effects';
import { SearchLiveEffects } from './ngrx/search-live/search-live.effects';
import { searchLiveReducer } from './ngrx/search-live/search-live.reducer';

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
