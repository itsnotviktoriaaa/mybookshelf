import { Injectable } from '@angular/core';
import { GoogleApiService } from '../../core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { loadDetailBook, loadDetailBookFailure, loadDetailBookSuccess } from './detail-book.actions';
import { DetailBookInterface, DetailBookSmallInfo } from '../../../types/user/book.interface';

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
          map((data: DetailBookInterface) => {
            const transformedData: DetailBookSmallInfo = {
              id: data.id,
              title: data.volumeInfo.title,
              authors: data.volumeInfo.authors,
              publishedDate: data.volumeInfo.publishedDate,
              publisher: data.volumeInfo.publisher,
              averageRating: data.volumeInfo.averageRating,
              accessInfo: { epub: data.accessInfo.epub.isAvailable, pdf: data.accessInfo.pdf.isAvailable },
              thumbnail: data.volumeInfo.imageLinks.thumbnail,
              description: data.volumeInfo.description,
              webReaderLink: data.accessInfo.webReaderLink,
            };

            return loadDetailBookSuccess({ data: transformedData });
          }),
          catchError(error => of(loadDetailBookFailure({ error })))
        );
      })
    );
  });
}
