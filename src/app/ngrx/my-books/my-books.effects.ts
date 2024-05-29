import {
  loadMyBooks,
  loadMyBooksFailure,
  loadMyBooksSuccess,
  removeFromMyBooks,
  removeFromMyBooksFailure,
  removeFromMyBooksSuccess,
} from './my-books.actions';
import { IBookItemTransformed } from '../../models/personal-library';
import { DatabaseService, NotificationService } from '../../core';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationStatusEnum } from '../../models/auth';
import { TranslateService } from '@ngx-translate/core';
import { TypedAction } from '@ngrx/store/src/models';
import { DocumentData } from '@firebase/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class MyBooksEffects {
  constructor(
    private databaseService: DatabaseService,
    private notificationService: NotificationService,
    private actions$: Actions,
    private translateService: TranslateService
  ) {}

  loadMyBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMyBooks),
      switchMap(() => {
        return this.databaseService.getSelfBooks().pipe(
          map((data: DocumentData[]): { data: IBookItemTransformed[] } & TypedAction<string> => {
            const transformedData: IBookItemTransformed[] = data.map((item: DocumentData) => ({
              id: item['id'],
              title: item['title'],
              author: item['author'],
              description: item['description'],
              webReaderLink: item['webReaderLink'],
              thumbnail: item['thumbnail'],
              publishedDate: item['publishedDate'],
            })) as IBookItemTransformed[];

            return loadMyBooksSuccess({
              data: transformedData,
            });
          }),
          catchError(() => of(loadMyBooksFailure({ error: null })))
        );
      })
    );
  });

  removeFromMyBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(removeFromMyBooks),
      switchMap(action => {
        this.notificationService.notifyAboutNotificationLoader(true);
        return this.databaseService
          .deleteBookAndFile(action.id, action.webReaderLink, action.thumbnail)
          .pipe(
            switchMap(() => {
              const messageKey = 'message.selfBookDeletedSuccessfully';
              const message = this.translateService.instant(messageKey);
              this.notificationService.notifyAboutNotification({
                message: message,
                status: NotificationStatusEnum.SUCCESS,
              });
              return of(removeFromMyBooksSuccess({ bookId: action.id }));
            }),
            catchError(() => {
              const messageKey = 'message.selfBookDeletedWithError';
              const message = this.translateService.instant(messageKey);
              this.notificationService.notifyAboutNotification({
                message: message,
                status: NotificationStatusEnum.ERROR,
              });
              return of(removeFromMyBooksFailure({ error: null }));
            }),
            finalize(() => {
              this.notificationService.notifyAboutNotificationLoader(false);
            })
          );
      })
    );
  });
}
