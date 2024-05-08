import {
  arrayFromBookItemTransformedInterface,
  BookInterface,
  BookItemInterface,
  BookItemTransformedInterface,
} from 'types/';
import { loadFavoritesBooks, loadFavoritesBooksFailure, loadFavoritesBooksSuccess } from './';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { Injectable } from '@angular/core';
import { GoogleApiService } from 'core/';

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
          map(
            (
              data: BookInterface
            ): { data: arrayFromBookItemTransformedInterface } & TypedAction<string> => {
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
              return loadFavoritesBooksSuccess({
                data: { items: transformedItems, totalItems: data.totalItems },
              });
            }
          ),
          catchError(error => of(loadFavoritesBooksFailure({ error })))
        );
      })
    );
  });
}
