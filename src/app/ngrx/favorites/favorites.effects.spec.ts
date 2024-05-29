import {
  IBook,
  IBookItem,
  IBookItemAccessInfo,
  IBookItemLayerInfo,
  IBookItemSaleInfo,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
  IBookItemVolumeInfo,
} from '../../models/personal-library';
import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooks,
  removeFromFavoritesBooksFailure,
  removeFromFavoritesBooksSuccess,
} from './favorites.actions';
import { GoogleApiService, NotificationService } from '../../core';
import { provideMockActions } from '@ngrx/effects/testing';
import { FavoritesEffects } from './favorites.effects';
import { TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

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
      'notifyAboutNotification',
      'notifyAboutNotificationLoader',
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
        selfLink: 'http://example.com/self',
        categories: ['Category One', 'Category Two'],
        userInfo: '2023-01-01',
        averageRating: 4.5,
      };

      const mockBookItemWithTotal: IBookItemTransformedWithTotal = {
        items: [mockBookItem],
        totalItems: 1,
      };

      const params = { q: 'test', startIndex: 0, maxResults: 40 };
      const action = loadFavoritesBooks({ params });
      const completion = loadFavoritesBooksSuccess({ data: mockBookItemWithTotal });

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
