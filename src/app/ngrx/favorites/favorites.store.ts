import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../modals/user';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { FavoriteService } from '../../core/services/favorite.service';
import { GoogleApiService, NotificationService } from '../../core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { NotificationStatusEnum } from '../../modals/auth';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

type FavoritesState = {
  favorites: IBookItemTransformedWithTotal;
  loading: boolean;
};

const initialState: FavoritesState = {
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
        notificationService.notifyAboutNotificationLoader(true);

        patchState(store, { loading: false });

        googleApiService
          .removeFavoriteBook(bookId)
          .pipe(
            tap(() => {
              const messageKey = 'favouriteBookDeletedSuccessfully';
              const message = translateService.instant(messageKey);
              notificationService.notifyAboutNotification({
                message: message,
                status: NotificationStatusEnum.success,
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
              const messageKey = 'favouriteBookDeletedWithError';
              const message = translateService.instant(messageKey);
              notificationService.notifyAboutNotification({
                message: message,
                status: NotificationStatusEnum.error,
              });
              return throwError(() => error);
            }),
            finalize((): void => {
              notificationService.notifyAboutNotificationLoader(false);
            })
          )
          .subscribe();
      },
    })
  )
);
