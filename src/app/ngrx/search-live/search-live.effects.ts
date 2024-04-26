import { GoogleApiService } from '../../core';
import {
  SearchDetailInterface,
  SearchInfoDetail,
  SearchInterface,
  SelectedHeaderModalItemEnum,
} from '../../modals/user';
import {
  loadSearchLiveBooks,
  loadSearchLiveBooksFailure,
  loadSearchLiveBooksSuccess,
} from './search-live.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class SearchLiveEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadSearchLive$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSearchLiveBooks),
      switchMap(action => {
        return this.googleApi.getSearchBooksLive(action.textFromInput, action.typeFromInput).pipe(
          map((data: SearchInfoDetail): SearchInterface => {
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

            return { totalItems: data.totalItems, items: transformedDataItems };
          }),
          map((data: SearchInterface | null) => {
            if (data && data.items) {
              return data.items.map((item: SearchDetailInterface): string => {
                const typeFromInput: string = action.typeFromInput.toLowerCase();

                if (
                  typeFromInput === SelectedHeaderModalItemEnum.Title.toLowerCase() ||
                  typeFromInput === SelectedHeaderModalItemEnum.Text.toLowerCase() ||
                  typeFromInput == SelectedHeaderModalItemEnum.All.toLowerCase()
                ) {
                  if (item.title) {
                    return item.title;
                  }
                }

                if (typeFromInput === SelectedHeaderModalItemEnum.Author.toLowerCase()) {
                  if (item.authors && item.authors.length > 0) {
                    return item.authors[0];
                  }
                }

                return '';
              });
            }
            return [];
          }),
          map(
            (
              data: string[]
            ): { data: string[] } & TypedAction<'[Search Live] Load Search Live Books Success'> => {
              const newArrayOfRequests = new Set<string>();
              data.forEach((text: string): void => {
                newArrayOfRequests.add(text);
              });
              return loadSearchLiveBooksSuccess({
                data: Array.from(newArrayOfRequests.values()),
              });
            }
          ),
          catchError(error => of(loadSearchLiveBooksFailure({ error })))
        );
      })
    );
  });
}
