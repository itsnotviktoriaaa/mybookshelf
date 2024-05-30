import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IActiveParamsSearch, IBookItemTransformedWithTotal } from 'app/models';
import { GoogleApiService, NotificationService } from 'app/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationStatusEnum } from 'app/models';
import { FavoriteService } from 'app/core';
import { inject } from '@angular/core';

type FavoritesState = {
  favorites: IBookItemTransformedWithTotal;
  loading: boolean;
};

export const initialState: FavoritesState = {
  favorites: {
    items: [],
    totalItems: 0,
  },
  loading: false,
};

export const FavouriteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      favoriteService = inject(FavoriteService),
      googleApiService = inject(GoogleApiService),
      notificationService = inject(NotificationService),
      translateService = inject(TranslateService)
    ) => ({
      loadAll(newParamsForFavorite: IActiveParamsSearch) {
        patchState(store, { loading: true });

        favoriteService
          .getFavorites(newParamsForFavorite)
          .pipe(
            tap((favorites: IBookItemTransformedWithTotal): void => {
              patchState(store, { favorites, loading: false });
            })
          )
          .subscribe();
      },

      deleteLoadFavoriteBook(bookId: string) {
        notificationService.setNotificationLoader(true);

        patchState(store, { loading: false });

        googleApiService
          .removeFavoriteBook(bookId)
          .pipe(
            tap(() => {
              const messageKey = 'message.favouriteBookDeletedSuccessfully';
              const message = translateService.instant(messageKey);
              notificationService.sendNotification({
                message: message,
                status: NotificationStatusEnum.SUCCESS,
              });

              if (!store.favorites) {
                patchState(store, { loading: false });
                return;
              }

              if (
                store &&
                store.favorites &&
                store.favorites.items &&
                store.favorites.items.length === 1
              ) {
                patchState(store, { favorites: undefined, loading: false });
                return;
              }

              patchState(store, state => ({
                favorites: {
                  items: state.favorites.items.filter(favorite => favorite.id !== bookId),
                  totalItems: state.favorites.totalItems - 1,
                },
                loading: false,
              }));
            }),
            catchError(error => {
              const messageKey = 'message.favouriteBookDeletedWithError';
              const message = translateService.instant(messageKey);
              notificationService.sendNotification({
                message: message,
                status: NotificationStatusEnum.ERROR,
              });
              return throwError(() => error);
            }),
            finalize((): void => {
              notificationService.setNotificationLoader(false);
            })
          )
          .subscribe();
      },
    })
  )
);
