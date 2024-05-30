import { loadDetailBook, loadDetailBookFailure, loadDetailBookSuccess } from './';
import { IDetailBook, IDetailBookSmallInfo } from 'app/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GoogleApiService } from 'app/core';
import { Injectable } from '@angular/core';

@Injectable()
export class DetailBookEffects {
  constructor(
    private googleApi: GoogleApiService,
    private actions$: Actions
  ) {}

  loadDetailBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadDetailBook),
      switchMap(action => {
        return this.googleApi.getDetailBook(action.idOfBook).pipe(
          map((data: IDetailBook) => {
            const transformedData: IDetailBookSmallInfo = {
              id: data.id,
              title: data.volumeInfo.title,
              authors: data.volumeInfo.authors,
              publishedDate: data.volumeInfo.publishedDate,
              publisher: data.volumeInfo.publisher,
              averageRating: data.volumeInfo.averageRating,
              accessInfo: [],
              thumbnail: data.volumeInfo.imageLinks.thumbnail,
              description: data.volumeInfo.description,
              webReaderLink: data.accessInfo.webReaderLink,
            };

            if (data.accessInfo.epub.isAvailable) {
              transformedData.accessInfo.push('EPUB');
            }

            if (data.accessInfo.pdf.isAvailable) {
              transformedData.accessInfo.push('PDF');
            }
            return loadDetailBookSuccess({ data: transformedData });
          }),
          catchError(() => of(loadDetailBookFailure({ error: null })))
        );
      })
    );
  });
}
