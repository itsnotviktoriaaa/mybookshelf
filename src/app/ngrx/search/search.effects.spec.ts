import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from 'app/core';
import { infoDetail } from 'app/ngrx';
import { SearchEffects } from './';

describe('SearchEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getSearchBooksDefault']);

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(SearchEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadSearchBooksSuccess on success', done => {
    const action = loadSearchBooks({
      params: {
        q: 'angular',
        maxResults: 40,
        startIndex: 0,
      },
    });
    const successAction = loadSearchBooksSuccess({
      data: {
        totalItems: infoDetail.totalItems,
        items: [
          {
            id: '1',
            thumbnail: infoDetail.items[0].volumeInfo.imageLinks.thumbnail,
            title: infoDetail.items[0].volumeInfo.title,
            authors: infoDetail.items[0].volumeInfo.authors,
            publishedDate: infoDetail.items[0].volumeInfo.publishedDate,
            publisher: infoDetail.items[0].volumeInfo.publisher,
            categories: infoDetail.items[0].volumeInfo.categories,
            pageCount: infoDetail.items[0].volumeInfo.pageCount,
          },
          {
            id: '2',
            thumbnail: infoDetail.items[1].volumeInfo.imageLinks.thumbnail,
            title: infoDetail.items[1].volumeInfo.title,
            authors: infoDetail.items[1].volumeInfo.authors,
            publishedDate: infoDetail.items[1].volumeInfo.publishedDate,
            publisher: infoDetail.items[1].volumeInfo.publisher,
            categories: infoDetail.items[1].volumeInfo.categories,
            pageCount: infoDetail.items[1].volumeInfo.pageCount,
          },
        ],
      },
    });

    actions$ = of(action);
    googleApiService.getSearchBooksDefault.and.returnValue(of(infoDetail));

    effects.loadSearch$.subscribe(result => {
      expect(result).toEqual(successAction);
      done();
    });
  });

  it('should return loadSearchBooksFailure on error', done => {
    const action = loadSearchBooks({
      params: {
        q: 'angular',
        maxResults: 40,
        startIndex: 0,
      },
    });
    const error = new Error('Search failed');
    const completion = loadSearchBooksFailure({ error: null });

    actions$ = of(action);
    googleApiService.getSearchBooksDefault.and.returnValue(throwError(() => error));

    effects.loadSearch$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });
});
