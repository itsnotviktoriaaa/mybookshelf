import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooks,
  removeFromFavoritesBooksFailure,
  removeFromFavoritesBooksSuccess,
} from './';
import { GoogleApiService, NotificationService } from 'app/core';
import { mockBook, mockBookItemWithTotalFav } from 'app/ngrx';
import { provideMockActions } from '@ngrx/effects/testing';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { FavoritesEffects } from './';

describe('FavoritesEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: FavoritesEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', [
      'getFavorites',
      'removeFavoriteBook',
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'sendNotification',
      'setNotificationLoader',
    ]);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    TestBed.configureTestingModule({
      providers: [
        FavoritesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: TranslateService, useValue: translateSpy },
      ],
    });

    effects = TestBed.inject(FavoritesEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  describe('loadFavoritesBooks$', () => {
    it('should return loadFavoritesBooksSuccess on success', done => {
      const params = { q: 'test', startIndex: 0, maxResults: 40 };
      const action = loadFavoritesBooks({ params });
      const completion = loadFavoritesBooksSuccess({ data: mockBookItemWithTotalFav });

      actions$ = of(action);
      googleApiService.getFavorites.and.returnValue(of(mockBook));

      effects.loadFavoritesBooks$.subscribe(result => {
        expect(result).toEqual(completion);
        done();
      });
    });

    it('should return loadFavoritesBooksFailure on error', done => {
      const params = { q: 'test', startIndex: 0, maxResults: 40 };
      const action = loadFavoritesBooks({ params });
      const error = new Error('error');
      const completion = loadFavoritesBooksFailure({ error: null });

      actions$ = of(action);
      googleApiService.getFavorites.and.returnValue(throwError(() => error));

      effects.loadFavoritesBooks$.subscribe(result => {
        expect(result).toEqual(completion);
        done();
      });
    });
  });

  describe('removeFromFavorites$', () => {
    it('should return removeFromFavoritesBooksSuccess on success', done => {
      const bookId = '1';
      const action = removeFromFavoritesBooks({ bookId });
      const completion = removeFromFavoritesBooksSuccess({ bookId });

      actions$ = of(action);
      googleApiService.removeFavoriteBook.and.returnValue(of({}));

      effects.removeFromFavorites$.subscribe(result => {
        expect(result).toEqual(completion);
        done();
      });
    });

    it('should return removeFromFavoritesBooksFailure on error', done => {
      const bookId = '1';
      const action = removeFromFavoritesBooks({ bookId });
      const error = new Error('error');
      const completion = removeFromFavoritesBooksFailure({ error: null });

      actions$ = of(action);
      googleApiService.removeFavoriteBook.and.returnValue(throwError(() => error));

      effects.removeFromFavorites$.subscribe(result => {
        expect(result).toEqual(completion);
        done();
      });
    });
  });
});
