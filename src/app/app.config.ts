import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';

import { CustomRouterStateSerializer } from './ngrx/router/router-state-serializer';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { DetailBookEffects } from './ngrx/detail-book/detail-book.effects';
import { SearchLiveEffects } from './ngrx/search-live/search-live.effects';
import { searchLiveReducer } from './ngrx/search-live/search-live.reducer';
import { userReducer } from './ngrx/auth-firebase/auth-firebase.reducer';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { detailReducer } from './ngrx/detail-book/detail-book.reducer';
import { homeNowReducer, homeReducer } from './ngrx/home/home.reducer';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environment.development';
import { FavoritesEffects } from './ngrx/favorites/favorites.effects';
import { favoritesReducer } from './ngrx/favorites/favorites.reducer';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthorEffects } from './ngrx/author/author.effects';
import { authorReducer } from './ngrx/author/author.reducer';
import { SearchEffects } from './ngrx/search/search.effects';
import { searchReducer } from './ngrx/search/search.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { BookEffects } from './ngrx/home/home.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
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
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: !isDevMode(), // Restrict extension to log-only mode
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
        traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      }),
      StoreModule.forRoot({
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
      EffectsModule.forRoot([
        BookEffects,
        FavoritesEffects,
        DetailBookEffects,
        AuthorEffects,
        SearchEffects,
        SearchLiveEffects,
      ]),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      StoreRouterConnectingModule.forRoot({ serializer: CustomRouterStateSerializer }),
    ]),
    provideAngularSvgIcon(),
    provideOAuthClient(),
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
