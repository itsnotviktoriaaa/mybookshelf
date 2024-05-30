import { loadAuthor, loadAuthorFailure, loadAuthorSuccess } from './author.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ISearchInfoDetail, ISearchSmall } from 'app/models';
import { catchError, map, of, switchMap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { GoogleApiService } from 'app/core';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadAuthor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAuthor),
      switchMap(action => {
        return this.googleApi.getAuthorDetail(action.author).pipe(
          map((data: ISearchInfoDetail): { data: ISearchSmall } & TypedAction<string> => {
            const transformedDataItems: { thumbnail: string; id: string; title: string }[] =
              data.items.map(item => {
                return {
                  id: item.id,
                  thumbnail: item.volumeInfo.imageLinks.thumbnail,
                  title: item.volumeInfo.title,
                };
              });

            const transformedDataItemsWithoutExistingDetailId = transformedDataItems.filter(
              item => item.id !== action.idOfBook
            );

            const limitedTransformedDataItems =
              transformedDataItemsWithoutExistingDetailId.length > 2
                ? transformedDataItemsWithoutExistingDetailId.slice(0, 2)
                : transformedDataItemsWithoutExistingDetailId;

            return loadAuthorSuccess({
              data: { totalItems: data.totalItems, items: limitedTransformedDataItems },
            });
          }),
          catchError(() => of(loadAuthorFailure({ error: null })))
        );
      })
    );
  });
}
