import { loadQuotes, loadQuotesFailure, loadQuotesSuccess, selectQuotes } from 'app/ngrx';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { IQuotes, IQuotesSmall } from 'app/models';
import { Injectable } from '@angular/core';
import { QuotesService } from 'app/core';
import { Store } from '@ngrx/store';

@Injectable()
export class QuotesEffects {
  constructor(
    private quotesService: QuotesService,
    private actions$: Actions,
    private store: Store
  ) {}

  loadQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotes),
      withLatestFrom(this.store.select(selectQuotes)),
      switchMap(([, quotes]) => {
        if (quotes) {
          return EMPTY;
        }
        return this.quotesService.getQuotes().pipe(
          map((data: IQuotes[]): { data: IQuotesSmall[] } & TypedAction<string> => {
            const transformedDataItems: IQuotesSmall[] = data.map((item: IQuotes) => {
              return {
                _id: item._id,
                content: item.content,
                author: item.author,
              };
            });

            return loadQuotesSuccess({
              data: transformedDataItems,
            });
          }),
          catchError(() => of(loadQuotesFailure({ error: null })))
        );
      })
    );
  });
}
