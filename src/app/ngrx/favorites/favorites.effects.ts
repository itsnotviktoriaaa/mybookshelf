import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooks,
  removeFromFavoritesBooksFailure,
  removeFromFavoritesBooksSuccess,
} from './favorites.actions';
import {
  IBookItemTransformedWithTotal,
  IBook,
  IBookItem,
  IBookItemTransformed,
} from '../../modals/user';
import { catchError, exhaustMap, finalize, map, of, switchMap, tap } from 'rxjs';
import { GoogleApiService, NotificationService } from '../../core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { Injectable } from '@angular/core';

@Injectable()
export class FavoritesEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions,
    private notificationService: NotificationService
  ) {}

  loadFavoritesBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFavoritesBooks),
      switchMap(action => {
        return this.googleApi.getFavorites(action.params).pipe(
          map((data: IBook): { data: IBookItemTransformedWithTotal } & TypedAction<string> => {
            const transformedItems: IBookItemTransformed[] = data.items.map((item: IBookItem) => {
              return {
                id: item.id,
                thumbnail: item.volumeInfo.imageLinks.thumbnail,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors,
                publishedDate: item.volumeInfo.publishedDate,
                webReaderLink: item.accessInfo.webReaderLink,
                pageCount: item.volumeInfo.pageCount,
                selfLink: item.selfLink,
                categories: item.volumeInfo.categories,
                userInfo: item.userInfo?.updated,
                averageRating: item.volumeInfo.averageRating,
              };
            });

            const uniqueItems: IBookItemTransformed[] = this.filterUniqueBooks(transformedItems);
            return loadFavoritesBooksSuccess({
              data: { items: uniqueItems, totalItems: data.totalItems },
            });
          }),
          catchError(error => of(loadFavoritesBooksFailure({ error })))
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
        this.notificationService.notifyAboutNotificationLoader(true);
      }),
      exhaustMap(action => {
        return this.googleApi.removeFavoriteBook(action.bookId).pipe(
          map(() => removeFromFavoritesBooksSuccess({ bookId: action.bookId })),
          catchError(error => {
            return of(removeFromFavoritesBooksFailure({ error }));
          }),
          finalize(() => {
            this.notificationService.notifyAboutNotificationLoader(false);
          })
        );
      })
    );
  });
}
