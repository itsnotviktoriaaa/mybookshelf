import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environment.development';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { CustomRouterStateSerializer } from 'ngr/';
import { homeNowReducer, homeReducer } from 'ngr/';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DetailBookEffects } from 'ngr/';
import { SearchLiveEffects } from 'ngr/';
import { searchLiveReducer } from 'ngr/';
import { FavoritesEffects } from 'ngr/';
import { favoritesReducer } from 'ngr/';
import { routes } from './app.routes';
import { myBooksReducer } from 'ngr/';
import { MyBooksEffects } from 'ngr/';
import { detailReducer } from 'ngr/';
import { AuthorEffects } from 'ngr/';
import { authorReducer } from 'ngr/';
import { SearchEffects } from 'ngr/';
import { searchReducer } from 'ngr/';
import { userReducer } from 'ngr/';
import { BookEffects } from 'ngr/';

// const scrollConfig: InMemoryScrollingOptions = {
//   scrollPositionRestoration: 'enabled',
// };
//
// const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom([
      RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
      }),
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      StoreRouterConnectingModule.forRoot({ serializer: CustomRouterStateSerializer }),
      StoreModule.forRoot({
        home: homeReducer,
        homeNow: homeNowReducer,
        favorites: favoritesReducer,
        detailBook: detailReducer,
        author: authorReducer,
        search: searchReducer,
        searchLive: searchLiveReducer,
        myBooks: myBooksReducer,
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
        MyBooksEffects,
      ]),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
    ]),
    provideAngularSvgIcon(),
    provideOAuthClient(),
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
