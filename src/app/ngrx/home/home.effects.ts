import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { loadReadingNowBooks, loadReadingNowBooksFailure, loadReadingNowBooksSuccess, loadRecommendedBooks, loadRecommendedBooksFailure, loadRecommendedBooksSuccess } from './home.actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { GoogleApiService } from '../../core/auth/google-api.service';
import { arrayFromBookItemTransformedInterface, BookInterface, BookItemInterface, BookItemTransformedInterface } from '../../../types/user/book.interface';
import { TypedAction } from '@ngrx/store/src/models';
import { selectRecommendedBooks } from './home.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class BookEffects {
  private _previousStartIndexForRecommendedBook: number = 0;
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
        return !recommendedBooks || action.startIndex !== this._previousStartIndexForRecommendedBook;
      }),
      switchMap(([action]) =>
        this.googleApi.getRecommended(action.startIndex).pipe(
          tap(() => {
            this._previousStartIndexForRecommendedBook = action.startIndex;
          }),
          map((data: BookInterface): { data: arrayFromBookItemTransformedInterface } & TypedAction<'[Book] Load Recommended Books Success'> => {
            const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
              return {
                selfLink: item.selfLink,
                thumbnail: item.volumeInfo.imageLinks.thumbnail,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors,
                publishedDate: item.volumeInfo.publishedDate,
                fullPrice: item.saleInfo.listPrice?.amount + ' ' + item.saleInfo.listPrice?.currencyCode,
                categories: item.volumeInfo.categories,
                webReaderLink: item.accessInfo.webReaderLink,
                pageCount: item.volumeInfo.pageCount,
                contentVersion: item.volumeInfo.contentVersion,
                publisher: item.volumeInfo.publisher,
              };
            });

            return loadRecommendedBooksSuccess({ data: { items: transformedItems, totalItems: data.totalItems } });
          }),
          catchError(error => of(loadRecommendedBooksFailure({ error })))
        )
      )
    );
  });

  loadReadingNowBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReadingNowBooks),
      switchMap(() =>
        this.googleApi.getReadingNow().pipe(
          map((data: BookInterface): { data: arrayFromBookItemTransformedInterface } & TypedAction<'[Book] Load Reading Now Books Success'> => {
            const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
              return {
                selfLink: item.selfLink,
                thumbnail: item.volumeInfo.imageLinks.thumbnail,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors,
                publishedDate: item.volumeInfo.publishedDate,
                fullPrice: item.saleInfo.listPrice?.amount + ' ' + item.saleInfo.listPrice?.currencyCode,
                categories: item.volumeInfo.categories,
                webReaderLink: item.accessInfo.webReaderLink,
                pageCount: item.volumeInfo.pageCount,
                contentVersion: item.volumeInfo.contentVersion,
                publisher: item.volumeInfo.publisher,
              };
            });

            return loadReadingNowBooksSuccess({ data: { items: transformedItems, totalItems: data.totalItems } });
          }),
          catchError(error => of(loadReadingNowBooksFailure({ error })))
        )
      )
    );
  });
}
