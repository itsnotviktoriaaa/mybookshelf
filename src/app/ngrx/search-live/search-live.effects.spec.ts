import { loadSearchLiveBooks, loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess } from './';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from 'app/core';
import { SearchLiveEffects } from './';
import { infoDetail } from 'app/ngrx';

describe('SearchLiveEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: SearchLiveEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getSearchBooksLive']);

    TestBed.configureTestingModule({
      providers: [
        SearchLiveEffects,
        provideMockActions(() => actions$),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(SearchLiveEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadSearchLiveBooksSuccess action with unique book titles on success', () => {
    const action = loadSearchLiveBooks({ textFromInput: 'Test', typeFromInput: 'Title' });

    actions$ = of(action);
    googleApiService.getSearchBooksLive.and.returnValue(of(infoDetail));

    const expected = loadSearchLiveBooksSuccess({ data: ['Book Title 1', 'Book Title 2'] });

    effects.loadSearchLive$.subscribe(result => {
      expect(result).toEqual(expected);
    });
  });

  it('should return loadSearchLiveBooksFailure action on error', () => {
    const action = loadSearchLiveBooks({ textFromInput: 'Test', typeFromInput: 'Title' });
    const error = new Error('error');

    actions$ = of(action);
    googleApiService.getSearchBooksLive.and.returnValue(throwError(() => error));

    const expected = loadSearchLiveBooksFailure({ error: null });

    effects.loadSearchLive$.subscribe(result => {
      expect(result).toEqual(expected);
    });
  });
});
