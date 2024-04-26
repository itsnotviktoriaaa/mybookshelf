import { GoogleApiService } from '../../core';
import { SearchInfoDetail, SearchSmallInterface } from '../../modals/user';
import { loadAuthor, loadAuthorFailure, loadAuthorSuccess } from './author.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { catchError, map, of, switchMap } from 'rxjs';

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
          map((data: SearchInfoDetail): { data: SearchSmallInterface } & TypedAction<string> => {
            const transformedDataItems: { thumbnail: string; id: string; title: string }[] =
              data.items.map(item => {
                return {
                  id: item.id,
                  thumbnail: item.volumeInfo.imageLinks.thumbnail,
                  title: item.volumeInfo.title,
                };
              });
            return loadAuthorSuccess({
              data: { totalItems: data.totalItems, items: transformedDataItems },
            });
          }),
          catchError(error => of(loadAuthorFailure({ error })))
        );
      })
    );
  });
}
