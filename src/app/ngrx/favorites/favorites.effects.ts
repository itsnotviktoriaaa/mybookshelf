import { Injectable } from '@angular/core';
import { GoogleApiService } from '../../core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
} from './favorites.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  arrayFromBookItemTransformedInterface,
  BookInterface,
  BookItemInterface,
  BookItemTransformedInterface,
} from '../../modals/user';

@Injectable()
export class FavoritesEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadFavoritesBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFavoritesBooks),
      switchMap(action => {
        return this.googleApi.getFavorites(action.params).pipe(
          map((data: BookInterface): { data: arrayFromBookItemTransformedInterface } => {
            const transformedItems: BookItemTransformedInterface[] = data.items.map(
              (item: BookItemInterface) => {
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
              }
            );

            const uniqueItems: BookItemTransformedInterface[] =
              this.filterUniqueBooks(transformedItems);
            return loadFavoritesBooksSuccess({
              data: { items: uniqueItems, totalItems: data.totalItems },
            });
          }),
          catchError(error => of(loadFavoritesBooksFailure({ error })))
        );
      })
    );
  });

  filterUniqueBooks(books: BookItemTransformedInterface[]): BookItemTransformedInterface[] {
    return books.filter((book, index, self) => index === self.findIndex(b => b.id === book.id));
  }
}
