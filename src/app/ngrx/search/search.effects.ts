import { Injectable } from '@angular/core';
import { GoogleApiService } from '../../core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SearchDetailInterface, SearchInfoDetail, SearchInterface } from '../../types/user';
import { TypedAction } from '@ngrx/store/src/models';
import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSearchBooks),
      switchMap(action => {
        return this.googleApi.getSearchBooksDefault(action.term).pipe(
          map((data: SearchInfoDetail): { data: SearchInterface } & TypedAction<string> => {
            console.log(data);
            const transformedDataItems: SearchDetailInterface[] = data.items.map(item => {
              return {
                id: item.id,
                thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
                title: item.volumeInfo?.title,
                authors: item.volumeInfo?.authors,
                publishedDate: item.volumeInfo?.publishedDate,
                publisher: item.volumeInfo?.publisher,
                categories: item.volumeInfo?.categories,
                pageCount: item.volumeInfo?.pageCount,
              };
            });

            return loadSearchBooksSuccess({
              data: { totalItems: data.totalItems, items: transformedDataItems },
            });
          }),
          catchError(error => of(loadSearchBooksFailure({ error })))
        );
      })
    );
  });
}
