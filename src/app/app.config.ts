import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DetailBookEffects } from 'app/ngrx';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { homeNowReducer, homeReducer } from 'app/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { FavoritesEffects } from 'app/ngrx';
import { favoritesReducer } from 'app/ngrx';
import { StoreModule } from '@ngrx/store';
import { detailReducer } from 'app/ngrx';
import { AuthorEffects } from 'app/ngrx';
import { authorReducer } from 'app/ngrx';
import { BookEffects } from 'app/ngrx';
import { routes } from './app.routes';

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
      StoreModule.forRoot({
        home: homeReducer,
        homeNow: homeNowReducer,
        favorites: favoritesReducer,
        detailBook: detailReducer,
        author: authorReducer,
      }),
      EffectsModule.forRoot([BookEffects, FavoritesEffects, DetailBookEffects, AuthorEffects]),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
    ]),
    provideAngularSvgIcon(),
    provideOAuthClient(),
  ],
};
