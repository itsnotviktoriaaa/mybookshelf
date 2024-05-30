import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './home.actions';
import { mockBook, mockBookItemWithTotalHome } from 'app/ngrx';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BookEffects } from './home.effects';
import { GoogleApiService } from 'app/core';

describe('HomeEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: BookEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', [
      'getRecommended',
      'getReadingNow',
    ]);

    TestBed.configureTestingModule({
      providers: [
        BookEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(BookEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadRecommendedBooksSuccess on successful loadRecommendedBooks', () => {
    googleApiService.getRecommended.and.returnValue(of(mockBook));

    actions$ = of(loadRecommendedBooks({ startIndex: 0 }));

    effects.loadRecommendedBooks$.subscribe(action => {
      expect(action).toEqual(loadRecommendedBooksSuccess({ data: mockBookItemWithTotalHome }));
    });
  });

  it('should return loadRecommendedBooksFailure on error in loadRecommendedBooks', () => {
    const error = new Error('Failed to load data');
    googleApiService.getRecommended.and.returnValue(throwError(() => error));

    actions$ = of(loadRecommendedBooks({ startIndex: 0 }));

    effects.loadRecommendedBooks$.subscribe(action => {
      expect(action).toEqual(loadRecommendedBooksFailure({ error: null }));
    });
  });

  it('should return loadReadingNowBooksSuccess on successful loadReadingNowBooks', () => {
    googleApiService.getReadingNow.and.returnValue(of(mockBook));

    actions$ = of(loadReadingNowBooks({ startIndex: 0 }));

    effects.loadReadingNowBooks$.subscribe(action => {
      expect(action).toEqual(loadReadingNowBooksSuccess({ data: mockBookItemWithTotalHome }));
    });
  });

  it('should return loadReadingNowBooksFailure on error in loadReadingNowBooks', () => {
    const error = new Error('Failed to load data');
    googleApiService.getReadingNow.and.returnValue(throwError(() => error));

    actions$ = of(loadReadingNowBooks({ startIndex: 0 }));

    effects.loadReadingNowBooks$.subscribe(action => {
      expect(action).toEqual(loadReadingNowBooksFailure({ error: null }));
    });
  });
});
