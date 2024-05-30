import { loadAuthor, loadAuthorFailure, loadAuthorSuccess } from './author.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ISearchInfoDetail } from 'app/models';
import { GoogleApiService } from 'app/core';
import { AuthorEffects } from 'app/ngrx';

describe('AuthorEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: AuthorEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getAuthorDetail']);

    TestBed.configureTestingModule({
      providers: [
        AuthorEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(AuthorEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadAuthorSuccess on success', done => {
    const authorDetail: ISearchInfoDetail = {
      kind: 'books#volumes',
      totalItems: 1,
      items: [
        {
          kind: 'books#volume',
          id: '1',
          etag: 'etag1',
          selfLink: 'http://example.com/1',
          volumeInfo: {
            title: 'Test Title 1',
            subtitle: 'Test Subtitle 1',
            authors: ['Author 1'],
            publisher: 'Test Publisher 1',
            publishedDate: '2020-01-01',
            description: 'Test Description 1',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '123-4567890123' },
            ],
            readingModes: { text: true, image: false },
            pageCount: 300,
            printType: 'BOOK',
            categories: ['Category 1'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: '1.0.0',
            panelizationSummary: {
              containsEpubBubbles: false,
              containsImageBubbles: false,
            },
            imageLinks: {
              smallThumbnail: 'http://example.com/smallThumbnail1.jpg',
              thumbnail: 'http://example.com/thumbnail1.jpg',
            },
            language: 'en',
            previewLink: 'http://example.com/preview1',
            infoLink: 'http://example.com/info1',
            canonicalVolumeLink: 'http://example.com/canonical1',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: true,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 7.99, currencyCode: 'USD' },
            buyLink: 'http://example.com/buy1',
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true },
            pdf: { isAvailable: false },
            webReaderLink: 'http://example.com/webReader1',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          searchInfo: {
            textSnippet: 'Test Snippet 1',
          },
        },
      ],
    };
    const action = loadAuthor({ author: 'Test Author', idOfBook: '123' });
    const completion = loadAuthorSuccess({
      data: {
        totalItems: 1,
        items: [{ id: '1', thumbnail: 'http://example.com/thumbnail1.jpg', title: 'Test Title 1' }],
      },
    });

    actions$ = of(action);
    googleApiService.getAuthorDetail.and.returnValue(of(authorDetail));

    effects.loadAuthor$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });

  it('should return loadAuthorFailure on error', done => {
    const action = loadAuthor({ author: 'Test Author', idOfBook: '123' });
    const error = new Error('error');
    const completion = loadAuthorFailure({ error: null });

    actions$ = of(action);
    googleApiService.getAuthorDetail.and.returnValue(throwError(() => error));

    effects.loadAuthor$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });
});
