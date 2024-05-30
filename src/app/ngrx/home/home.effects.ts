import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './';
import { IBookItemTransformedWithTotal, IBook, IBookItem, IBookItemTransformed } from 'app/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { GoogleApiService } from 'app/core';
import { Injectable } from '@angular/core';

@Injectable()
export class BookEffects {
  constructor(
    private actions$: Actions,
    private googleApi: GoogleApiService
  ) {}

  loadRecommendedBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadRecommendedBooks),
      switchMap(action =>
        this.googleApi.getRecommended(action.startIndex).pipe(
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
          catchError(() => of(loadRecommendedBooksFailure({ error: null })))
        )
      )
    );
  });

  loadReadingNowBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReadingNowBooks),
      switchMap(action =>
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
          catchError(() => of(loadReadingNowBooksFailure({ error: null })))
        )
      )
    );
  });
}
