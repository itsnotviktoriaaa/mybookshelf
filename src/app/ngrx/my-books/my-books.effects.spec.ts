import {
  loadMyBooks,
  loadMyBooksFailure,
  loadMyBooksSuccess,
  removeFromMyBooks,
  removeFromMyBooksFailure,
  removeFromMyBooksSuccess,
} from './my-books.actions';
import { DatabaseService, NotificationService } from '../../core';
import { finalize, Observable, of, tap, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { IBookItemTransformed } from '../../modals/user';
import { TranslateService } from '@ngx-translate/core';
import { MyBooksEffects } from './my-books.effects';
import { DocumentData } from '@firebase/firestore';
import { TestBed } from '@angular/core/testing';

describe('MyBooksEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: MyBooksEffects;
  let databaseServiceSpy: jasmine.SpyObj<DatabaseService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const databaseService = jasmine.createSpyObj('DatabaseService', [
      'getSelfBooks',
      'deleteBookAndFile',
    ]);
    const notificationService = jasmine.createSpyObj('NotificationService', [
      'notifyAboutNotificationLoader',
      'notifyAboutNotification',
    ]);
    const translateService = jasmine.createSpyObj('TranslateService', ['instant']);

    TestBed.configureTestingModule({
      providers: [
        MyBooksEffects,
        provideMockActions(() => actions$),
        { provide: DatabaseService, useValue: databaseService },
        { provide: NotificationService, useValue: notificationService },
        { provide: TranslateService, useValue: translateService },
      ],
    });

    effects = TestBed.inject(MyBooksEffects);
    databaseServiceSpy = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  it('should dispatch loadMyBooksSuccess action with data on successful load', () => {
    const mockBooks: DocumentData[] = [
      {
        id: '1',
        title: 'Book 1',
        author: ['Author 1'],
        webReaderLink: '',
        thumbnail: '',
        publishedDate: '',
        description: '',
      },
    ];
    const expectedTransformedBooks: IBookItemTransformed[] = [
      {
        id: '1',
        title: 'Book 1',
        author: ['Author 1'],
        webReaderLink: '',
        thumbnail: '',
        publishedDate: '',
        description: '',
      },
    ];
    databaseServiceSpy.getSelfBooks.and.returnValue(of(mockBooks));

    actions$ = of(loadMyBooks());

    effects.loadMyBooks$.subscribe(result => {
      expect(result).toEqual(loadMyBooksSuccess({ data: expectedTransformedBooks }));
    });
  });

  it('should dispatch loadMyBooksFailure action on error during load', () => {
    const error = new Error('Failed to load books');
    databaseServiceSpy.getSelfBooks.and.returnValue(throwError(() => error));

    actions$ = of(loadMyBooks());

    effects.loadMyBooks$.subscribe(result => {
      expect(result).toEqual(loadMyBooksFailure({ error: null }));
    });
  });

  it('should dispatch removeFromMyBooksSuccess action on successful book removal', () => {
    const action = removeFromMyBooks({ id: '1', webReaderLink: '', thumbnail: '' });
    const expectedBookId = '1';
    databaseServiceSpy.deleteBookAndFile.and.returnValue(of(undefined));

    actions$ = of(action);

    effects.removeFromMyBooks$
      .pipe(
        tap(() => {
          expect(notificationServiceSpy.notifyAboutNotificationLoader).toHaveBeenCalledWith(true);
        }),
        finalize(() => {
          expect(notificationServiceSpy.notifyAboutNotificationLoader).toHaveBeenCalledWith(false);
        })
      )
      .subscribe(result => {
        expect(result).toEqual(removeFromMyBooksSuccess({ bookId: expectedBookId }));
      });
  });

  it('should dispatch removeFromMyBooksFailure action on error during book removal', () => {
    const action = removeFromMyBooks({ id: '1', webReaderLink: '', thumbnail: '' });
    const error = new Error('Failed to remove book');
    databaseServiceSpy.deleteBookAndFile.and.returnValue(throwError(() => error));

    actions$ = of(action);

    effects.removeFromMyBooks$
      .pipe(
        tap(() => {
          expect(notificationServiceSpy.notifyAboutNotificationLoader).toHaveBeenCalledWith(true);
        }),
        finalize(() => {
          expect(notificationServiceSpy.notifyAboutNotificationLoader).toHaveBeenCalledWith(false);
        })
      )
      .subscribe(result => {
        expect(result).toEqual(removeFromMyBooksFailure({ error: null }));
      });
  });
});
