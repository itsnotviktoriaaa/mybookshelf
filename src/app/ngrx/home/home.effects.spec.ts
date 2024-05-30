import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './home.actions';
import {
  IBook,
  IBookItem,
  IBookItemAccessInfo,
  IBookItemLayerInfo,
  IBookItemSaleInfo,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
  IBookItemVolumeInfo,
} from 'app/models';
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

  const mockBookItemAccessInfo: IBookItemAccessInfo = {
    accessViewStatus: 'SAMPLE',
    country: 'US',
    embeddable: true,
    epub: {
      isAvailable: true,
      acsTokenLink: 'http://example.com/epub-token',
    },
    pdf: {
      isAvailable: false,
    },
    publicDomain: false,
    quoteSharingAllowed: true,
    textToSpeechPermission: 'ALLOWED',
    viewability: 'PARTIAL',
    webReaderLink: 'http://example.com/web-reader',
  };

  const mockBookItemLayerInfo: IBookItemLayerInfo = {
    layers: [
      {
        layerId: 'layer1',
        volumeAnnotationsVersion: '1.0',
      },
    ],
  };

  const mockBookItemSaleInfo: IBookItemSaleInfo = {
    buyLink: 'http://example.com/buy',
    country: 'US',
    isEbook: true,
    listPrice: {
      amount: 9.99,
      currencyCode: 'USD',
    },
    retailPrice: {
      amount: 7.99,
      currencyCode: 'USD',
    },
    saleability: 'FOR_SALE',
  };

  const mockBookItemVolumeInfo: IBookItemVolumeInfo = {
    allowAnonLogging: true,
    authors: ['Author One', 'Author Two'],
    averageRating: 4.5,
    canonicalVolumeLink: 'http://example.com/canonical',
    categories: ['Category One', 'Category Two'],
    contentVersion: '1.0',
    description: 'A test book description',
    imageLinks: {
      smallThumbnail: 'http://example.com/small-thumbnail.jpg',
      thumbnail: 'http://example.com/thumbnail.jpg',
    },
    industryIdentifiers: [
      {
        type: 'ISBN_10',
        identifier: '1234567890',
      },
      {
        type: 'ISBN_13',
        identifier: '123-1234567890',
      },
    ],
    infoLink: 'http://example.com/info',
    maturityRating: 'NOT_MATURE',
    pageCount: 320,
    panelizationSummary: {
      containsEpubBubbles: false,
      containsImageBubbles: false,
    },
    previewLink: 'http://example.com/preview',
    printType: 'BOOK',
    publishedDate: '2023-01-01',
    publisher: 'Test Publisher',
    ratingsCount: 100,
    readingModes: {
      text: true,
      image: false,
    },
    title: 'Test Book Title',
  };

  const mockBookItemT: IBookItem = {
    accessInfo: mockBookItemAccessInfo,
    etag: 'etag123',
    id: 'book1',
    kind: 'books#volume',
    layerInfo: mockBookItemLayerInfo,
    saleInfo: mockBookItemSaleInfo,
    selfLink: 'http://example.com/self',
    volumeInfo: mockBookItemVolumeInfo,
    userInfo: { updated: '2023-01-01' },
  };

  const mockBook: IBook = {
    items: [mockBookItemT],
    kind: 'books#volumes',
    totalItems: 1,
  };

  const mockBookItem: IBookItemTransformed = {
    id: 'book1',
    thumbnail: 'http://example.com/thumbnail.jpg',
    title: 'Test Book Title',
    author: ['Author One', 'Author Two'],
    publishedDate: '2023-01-01',
    webReaderLink: 'http://example.com/web-reader',
    pageCount: 320,
  };

  const mockBookItemWithTotal: IBookItemTransformedWithTotal = {
    items: [mockBookItem],
    totalItems: 1,
  };

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
      expect(action).toEqual(loadRecommendedBooksSuccess({ data: mockBookItemWithTotal }));
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
      expect(action).toEqual(loadReadingNowBooksSuccess({ data: mockBookItemWithTotal }));
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
