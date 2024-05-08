import { loadReadingNowBooks, loadReadingNowBooksFailure, loadReadingNowBooksSuccess, loadRecommendedBooks, loadRecommendedBooksFailure, loadRecommendedBooksSuccess } from './';
import { arrayFromBookItemTransformedInterface, BookInterface, BookItemInterface, BookItemTransformedInterface } from 'types/';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { Injectable } from '@angular/core';
import { GoogleApiService } from 'core/';
import { Store } from '@ngrx/store';

@Injectable()
export class BookEffects {
  private _previousStartIndexForRecommendedBook: number = 0;
  private _previousStartIndexForReadingBook: number = 0;
  constructor(
    private actions$: Actions,
    private googleApi: GoogleApiService,
    private store: Store
  ) {}

  loadRecommendedBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadRecommendedBooks),
      switchMap(action => {
        return this.googleApi.getRecommended(action.startIndex).pipe(
          tap(() => {
            this._previousStartIndexForRecommendedBook = action.startIndex;
          }),
          map(
            (
              data: BookInterface
            ): {
              data: arrayFromBookItemTransformedInterface;
            } & TypedAction<'[Book] Load Recommended Books Success'> => {
              const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
                return {
                  id: item.id,
                  thumbnail: item.volumeInfo.imageLinks.thumbnail,
                  title: item.volumeInfo.title,
                  author: item.volumeInfo.authors,
                  publishedDate: item.volumeInfo.publishedDate,
                  webReaderLink: item.accessInfo.webReaderLink,
                  pageCount: item.volumeInfo.pageCount,
                };
              });

              return loadRecommendedBooksSuccess({
                data: { items: transformedItems, totalItems: data.totalItems },
              });
            }
          ),
          catchError(error => of(loadRecommendedBooksFailure({ error })))
        );
      })
    );
  });

  loadReadingNowBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReadingNowBooks),
      switchMap(action => {
        return this.googleApi.getReadingNow(action.startIndex).pipe(
          map(
            (
              data: BookInterface
            ): {
              data: arrayFromBookItemTransformedInterface;
            } & TypedAction<'[Book] Load Reading Now Books Success'> => {
              const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
                return {
                  id: item.id,
                  thumbnail: item.volumeInfo.imageLinks.thumbnail,
                  title: item.volumeInfo.title,
                  author: item.volumeInfo.authors,
                  publishedDate: item.volumeInfo.publishedDate,
                  webReaderLink: item.accessInfo.webReaderLink,
                  pageCount: item.volumeInfo.pageCount,
                };
              });

              return loadReadingNowBooksSuccess({
                data: { items: transformedItems, totalItems: data.totalItems },
              });
            }
          ),
          catchError(error => of(loadReadingNowBooksFailure({ error })))
        );
      })
    );
  });
}
