import {
  ISearchDetail,
  ISearchInfoDetail,
  ISearch,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from '../../models/personal-library';
import { loadSearchLiveBooks, loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess } from './';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TypedAction } from '@ngrx/store/src/models';
import { GoogleApiService } from '../../core';
import { Injectable } from '@angular/core';

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
          map((data: ISearchInfoDetail): ISearch => {
            const transformedDataItems: ISearchDetail[] = data.items.map(item => {
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
          map((data: ISearch | null) => {
            if (data && data.items) {
              return data.items.map((item: ISearchDetail): string => {
                const typeFromInput: string = action.typeFromInput.toLowerCase();

                if (
                  typeFromInput === SelectedHeaderModalItemEngEnum.TITLE.toLowerCase() ||
                  typeFromInput === SelectedHeaderModalItemEngEnum.TEXT.toLowerCase() ||
                  typeFromInput == SelectedHeaderModalItemEngEnum.ALL.toLowerCase() ||
                  typeFromInput === SelectedHeaderModalItemRusEnum.TITLE.toLowerCase() ||
                  typeFromInput === SelectedHeaderModalItemRusEnum.TEXT.toLowerCase() ||
                  typeFromInput == SelectedHeaderModalItemRusEnum.ALL.toLowerCase()
                ) {
                  if (item.title) {
                    return item.title;
                  }
                }

                if (
                  typeFromInput === SelectedHeaderModalItemEngEnum.AUTHOR.toLowerCase() ||
                  typeFromInput === SelectedHeaderModalItemRusEnum.AUTHOR.toLowerCase()
                ) {
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
          catchError(() => of(loadSearchLiveBooksFailure({ error: null })))
        );
      })
    );
  });
}
