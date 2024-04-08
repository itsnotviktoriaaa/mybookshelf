import { Injectable } from '@angular/core';
import { GoogleApiService } from '../../core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadFavoritesBooks, loadFavoritesBooksFailure, loadFavoritesBooksSuccess } from './favorites.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { arrayFromBookItemTransformedInterface, BookInterface, BookItemInterface, BookItemTransformedInterface } from '../../../types/user/book.interface';

@Injectable()
export class FavoritesEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadFavoritesBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFavoritesBooks),
      switchMap(() => {
        return this.googleApi.getFavorites().pipe(
          map((data: BookInterface): { data: arrayFromBookItemTransformedInterface } => {
            const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface) => {
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
            return loadFavoritesBooksSuccess({ data: { items: transformedItems, totalItems: data.totalItems } });
          }),
          catchError(error => of(loadFavoritesBooksFailure({ error })))
        );
      })
    );
  });
}
