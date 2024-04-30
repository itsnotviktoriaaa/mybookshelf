import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './home.actions';
import {
  IBookItemTransformedWithTotal,
  IBook,
  IBookItem,
  IBookItemTransformed,
} from '../../modals/user';
import { selectReadingNowBooks, selectRecommendedBooks } from './home.selectors';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { GoogleApiService } from '../../core';
import { Injectable } from '@angular/core';
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
      concatLatestFrom(() => this.store.select(selectRecommendedBooks)),
      filter(([action, recommendedBooks]) => {
        return (
          !recommendedBooks || action.startIndex !== this._previousStartIndexForRecommendedBook
        );
      }),
      switchMap(([action]) =>
        this.googleApi.getRecommended(action.startIndex).pipe(
          tap(() => {
            this._previousStartIndexForRecommendedBook = action.startIndex;
          }),
          map(
            (
              data: IBook
            ): {
              data: IBookItemTransformedWithTotal;
            } & TypedAction<'[Book] Load Recommended Books Success'> => {
              const transformedItems: IBookItemTransformed[] = data.items.map(
                (item: IBookItem): IBookItemTransformed => {
                  return {
                    id: item.id,
                    thumbnail: item.volumeInfo.imageLinks.thumbnail,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors,
                    publishedDate: item.volumeInfo.publishedDate,
                    webReaderLink: item.accessInfo.webReaderLink,
                    pageCount: item.volumeInfo.pageCount,
                  };
                }
              );

              return loadRecommendedBooksSuccess({
                data: { items: transformedItems, totalItems: data.totalItems },
              });
            }
          ),
          catchError(error => of(loadRecommendedBooksFailure({ error })))
        )
      )
    );
  });

  loadReadingNowBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReadingNowBooks),
      concatLatestFrom(() => this.store.select(selectReadingNowBooks)),
      filter(([action, readingNowBooks]) => {
        return !readingNowBooks || action.startIndex !== this._previousStartIndexForReadingBook;
      }),
      switchMap(([action]) =>
        this.googleApi.getReadingNow(action.startIndex).pipe(
          map(
            (
              data: IBook
            ): {
              data: IBookItemTransformedWithTotal;
            } & TypedAction<'[Book] Load Reading Now Books Success'> => {
              const transformedItems: IBookItemTransformed[] = data.items.map(
                (item: IBookItem): IBookItemTransformed => {
                  return {
                    id: item.id,
                    thumbnail: item.volumeInfo.imageLinks.thumbnail,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors,
                    publishedDate: item.volumeInfo.publishedDate,
                    webReaderLink: item.accessInfo.webReaderLink,
                    pageCount: item.volumeInfo.pageCount,
                  };
                }
              );

              return loadReadingNowBooksSuccess({
                data: { items: transformedItems, totalItems: data.totalItems },
              });
            }
          ),
          catchError(error => of(loadReadingNowBooksFailure({ error })))
        )
      )
    );
  });
}
