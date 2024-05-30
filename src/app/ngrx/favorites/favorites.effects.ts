import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooks,
  removeFromFavoritesBooksFailure,
  removeFromFavoritesBooksSuccess,
} from './favorites.actions';
import { IBookItemTransformedWithTotal, IBook, IBookItemTransformed } from 'app/models';
import { BookTransformUtil, GoogleApiService, NotificationService } from 'app/core';
import { catchError, exhaustMap, finalize, map, of, switchMap, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { TypedAction } from '@ngrx/store/src/models';
import { NotificationStatusEnum } from 'app/models';
import { Injectable } from '@angular/core';

@Injectable()
export class FavoritesEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  loadFavoritesBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFavoritesBooks),
      switchMap(action => {
        return this.googleApi.getFavorites(action.params).pipe(
          map((data: IBook): { data: IBookItemTransformedWithTotal } & TypedAction<string> => {
            if (data.totalItems === 0) {
              return loadFavoritesBooksSuccess({
                data: { items: [], totalItems: 0 },
              });
            }

            const transformedItems: IBookItemTransformed[] = BookTransformUtil.transformBook(data);

            const uniqueItems: IBookItemTransformed[] = this.filterUniqueBooks(transformedItems);
            return loadFavoritesBooksSuccess({
              data: { items: uniqueItems, totalItems: data.totalItems },
            });
          }),
          catchError(() => of(loadFavoritesBooksFailure({ error: null })))
        );
      })
    );
  });

  filterUniqueBooks(books: IBookItemTransformed[]): IBookItemTransformed[] {
    return books.filter((book, index, self) => index === self.findIndex(b => b.id === book.id));
  }

  removeFromFavorites$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(removeFromFavoritesBooks),
      tap(() => {
        this.notificationService.setNotificationLoader(true);
      }),
      exhaustMap(action => {
        return this.googleApi.removeFavoriteBook(action.bookId).pipe(
          map(() => {
            const messageKey = 'message.favouriteBookDeletedSuccessfully';
            const message = this.translateService.instant(messageKey);
            this.notificationService.sendNotification({
              message: message,
              status: NotificationStatusEnum.SUCCESS,
            });
            return removeFromFavoritesBooksSuccess({ bookId: action.bookId });
          }),
          catchError(() => {
            const messageKey = 'message.favouriteBookDeletedWithError';
            const message = this.translateService.instant(messageKey);
            this.notificationService.sendNotification({
              message: message,
              status: NotificationStatusEnum.ERROR,
            });
            return of(removeFromFavoritesBooksFailure({ error: null }));
          }),
          finalize(() => {
            this.notificationService.setNotificationLoader(false);
          })
        );
      })
    );
  });
}
