import { loadQuotes, loadQuotesFailure, loadQuotesSuccess } from 'app/ngrx';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { IQuotes, IQuotesSmall } from 'app/models';
import { Injectable } from '@angular/core';
import { QuotesService } from 'app/core';

@Injectable()
export class QuotesEffects {
  constructor(
    private quotesService: QuotesService,
    private actions$: Actions
  ) {}

  loadQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotes),
      switchMap(() => {
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
