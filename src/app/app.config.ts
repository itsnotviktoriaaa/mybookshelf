import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';

import { CustomRouterStateSerializer } from './ngrx/router/router-state-serializer';
import { DetailBookEffects } from './ngrx/detail-book/detail-book.effects';
import { SearchLiveEffects } from './ngrx/search-live/search-live.effects';
import { searchLiveReducer } from './ngrx/search-live/search-live.reducer';
import { userReducer } from './ngrx/auth-firebase/auth-firebase.reducer';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { detailReducer } from './ngrx/detail-book/detail-book.reducer';
import { homeNowReducer, homeReducer } from './ngrx/home/home.reducer';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { environment } from '../environments/environment.development';
import { FavoritesEffects } from './ngrx/favorites/favorites.effects';
import { favoritesReducer } from './ngrx/favorites/favorites.reducer';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AuthorEffects } from './ngrx/author/author.effects';
import { authorReducer } from './ngrx/author/author.reducer';
import { SearchEffects } from './ngrx/search/search.effects';
import { searchReducer } from './ngrx/search/search.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { BookEffects } from './ngrx/home/home.effects';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';

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
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
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
      user: userReducer,
      router: routerReducer,
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
