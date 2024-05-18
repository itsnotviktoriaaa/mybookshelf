import {
  loadDetailBook,
  loadDetailBookFailure,
  loadDetailBookSuccess,
} from './detail-book.actions';
import { IDetailBook, IDetailBookSmallInfo } from '../../modals/user';
import { provideMockActions } from '@ngrx/effects/testing';
import { DetailBookEffects } from './detail-book.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from '../../core';

describe('DetailBookEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: DetailBookEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;
  const testDetailBook: IDetailBook = {
    kind: 'books#volume',
    id: '123',
    etag: 'etag',
    selfLink: 'http://example.com/selfLink',
    volumeInfo: {
      title: 'Test Book',
      authors: ['Author One', 'Author Two'],
      publisher: 'Test Publisher',
      publishedDate: '2021-01-01',
      description: 'This is a test book.',
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
      readingModes: {
        text: true,
        image: false,
      },
      pageCount: 320,
      printedPageCount: 320,
      dimensions: {
        height: '20cm',
        width: '13cm',
        thickness: '2cm',
      },
      printType: 'BOOK',
      categories: ['Category One', 'Category Two'],
      averageRating: 4.5,
      ratingsCount: 100,
      maturityRating: 'NOT_MATURE',
      allowAnonLogging: true,
      contentVersion: '1.2.3',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail: 'http://example.com/smallThumbnail.jpg',
        thumbnail: 'http://example.com/thumbnail.jpg',
      },
      language: 'en',
      previewLink: 'http://example.com/previewLink',
      infoLink: 'http://example.com/infoLink',
      canonicalVolumeLink: 'http://example.com/canonicalVolumeLink',
    },
    layerInfo: {
      layers: [
        {
          layerId: 'layer1',
          volumeAnnotationsVersion: '1.0',
        },
      ],
    },
    userInfo: {
      updated: '2021-01-01T00:00:00Z',
    },
    saleInfo: {
      country: 'US',
      saleability: 'FOR_SALE',
      isEbook: true,
    },
    accessInfo: {
      country: 'US',
      viewability: 'PARTIAL',
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: 'ALLOWED',
      epub: {
        isAvailable: true,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink: 'http://example.com/webReaderLink',
      accessViewStatus: 'SAMPLE',
      quoteSharingAllowed: true,
    },
  };

  const testDetailBookSmallInfo: IDetailBookSmallInfo = {
    id: '123',
    title: 'Test Book',
    authors: ['Author One', 'Author Two'],
    publishedDate: '2021-01-01',
    publisher: 'Test Publisher',
    averageRating: 4.5,
    accessInfo: ['EPUB'],
    thumbnail: 'http://example.com/thumbnail.jpg',
    description: 'This is a test book.',
    webReaderLink: 'http://example.com/webReaderLink',
  };

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getDetailBook']);

    TestBed.configureTestingModule({
      providers: [
        DetailBookEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(DetailBookEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadDetailBookSuccess on success', done => {
    const action = loadDetailBook({ idOfBook: '123' });
    const completion = loadDetailBookSuccess({ data: testDetailBookSmallInfo });

    actions$ = of(action);
    googleApiService.getDetailBook.and.returnValue(of(testDetailBook));

    effects.loadDetailBook$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });

  it('should return loadDetailBookFailure on error', done => {
    const action = loadDetailBook({ idOfBook: '123' });
    const error = new Error('error');
    const completion = loadDetailBookFailure({ error: null });

    actions$ = of(action);
    googleApiService.getDetailBook.and.returnValue(throwError(() => error));

    effects.loadDetailBook$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });
});
