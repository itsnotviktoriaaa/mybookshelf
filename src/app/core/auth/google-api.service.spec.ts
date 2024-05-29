import { IActiveParamsSearch, IBook, IDetailBook, ISearchInfoDetail } from '../../models/user';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { GoogleApiService } from './google-api.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('GoogleApiService', () => {
  let service: GoogleApiService;
  let httpMock: HttpTestingController;
  let oAuthServiceSpy: jasmine.SpyObj<OAuthService>;
  // let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const oAuthSpy = jasmine.createSpyObj('OAuthService', [
      'hasValidAccessToken',
      'getAccessToken',
      'revokeTokenAndLogout',
      'logOut',
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['checkEmailWasUsed', 'login', 'register']);
    const routerNavSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GoogleApiService,
        { provide: OAuthService, useValue: oAuthSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerNavSpy },
      ],
    });

    service = TestBed.inject(GoogleApiService);
    httpMock = TestBed.inject(HttpTestingController);
    oAuthServiceSpy = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
    // authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reading now books', () => {
    const dummyBooks: IBook = {
      items: [],
      kind: '',
      totalItems: 0,
    }; // Provide a mock response here
    service.getReadingNow(0).subscribe(books => {
      expect(books).toEqual(dummyBooks);
    });

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}3/volumes?maxResults=40&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyBooks);
  });

  it('should get favorite books', () => {
    const dummyBooks: IBook = {
      items: [],
      kind: '',
      totalItems: 0,
    };
    const params: IActiveParamsSearch = { q: 'test', maxResults: 40, startIndex: 0 };
    service.getFavorites(params).subscribe(books => {
      expect(books).toEqual(dummyBooks);
    });

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}0/volumes?q=test&maxResults=40&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyBooks);
  });

  it('should get recommended books', () => {
    const dummyBooks: IBook = {
      items: [],
      kind: '',
      totalItems: 0,
    };
    service.getRecommended(0).subscribe(books => {
      expect(books).toEqual(dummyBooks);
    });

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}8/volumes?maxResults=40&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyBooks);
  });

  it('should get book details', () => {
    const dummyBook: IDetailBook = {
      kind: 'books#volume',
      id: '1',
      etag: 'etag12345',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/12345',
      volumeInfo: {
        title: 'Sample Book Title',
        authors: ['Author One', 'Author Two'],
        publisher: 'Sample Publisher',
        publishedDate: '2023-01-01',
        description: 'This is a sample description of the book.',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '1234567890' },
          { type: 'ISBN_13', identifier: '123-4567890123' },
        ],
        readingModes: {
          text: true,
          image: false,
        },
        pageCount: 350,
        printedPageCount: 360,
        dimensions: {
          height: '23 cm',
          width: '15 cm',
          thickness: '2 cm',
        },
        printType: 'BOOK',
        categories: ['Category One', 'Category Two'],
        averageRating: 4.5,
        ratingsCount: 150,
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: true,
        contentVersion: '1.0.0',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail: 'http://example.com/small_thumbnail.jpg',
          thumbnail: 'http://example.com/thumbnail.jpg',
        },
        language: 'en',
        previewLink: 'http://example.com/preview',
        infoLink: 'http://example.com/info',
        canonicalVolumeLink: 'http://example.com/canonical',
      },
      layerInfo: {
        layers: [
          { layerId: 'layer1', volumeAnnotationsVersion: '1.0' },
          { layerId: 'layer2', volumeAnnotationsVersion: '1.1' },
        ],
      },
      userInfo: {
        updated: '2023-01-02T12:34:56.789Z',
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
          isAvailable: true,
        },
        webReaderLink: 'http://example.com/webreader',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: true,
      },
    };
    service.getDetailBook('1').subscribe(book => {
      expect(book).toEqual(dummyBook);
    });

    const req = httpMock.expectOne(`${environment.googleVolumeApi}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBook);
  });

  it('should get author details', () => {
    const dummyAuthorDetails: ISearchInfoDetail = {
      kind: 'books#volume',
      totalItems: 1,
      items: [
        {
          kind: 'books#volume',
          id: '12345',
          etag: 'etag12345',
          selfLink: 'https://www.googleapis.com/books/v1/volumes/12345',
          volumeInfo: {
            title: 'Sample Book Title',
            subtitle: 'Sample Book Subtitle',
            authors: ['Author One', 'Author Two'],
            publisher: 'Sample Publisher',
            publishedDate: '2023-01-01',
            description: 'This is a sample description of the book.',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '123-4567890123' },
            ],
            readingModes: {
              text: true,
              image: false,
            },
            pageCount: 350,
            printType: 'BOOK',
            categories: ['Category One', 'Category Two'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: '1.0.0',
            panelizationSummary: {
              containsEpubBubbles: false,
              containsImageBubbles: false,
            },
            imageLinks: {
              smallThumbnail: 'http://example.com/small_thumbnail.jpg',
              thumbnail: 'http://example.com/thumbnail.jpg',
            },
            language: 'en',
            previewLink: 'http://example.com/preview',
            infoLink: 'http://example.com/info',
            canonicalVolumeLink: 'http://example.com/canonical',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: true,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 8.99, currencyCode: 'USD' },
            buyLink: 'http://example.com/buy',
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true },
            pdf: { isAvailable: true },
            webReaderLink: 'http://example.com/webreader',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          searchInfo: {
            textSnippet: 'This is a sample text snippet.',
          },
        },
      ],
    };
    service.getAuthorDetail('test-author').subscribe(details => {
      expect(details).toEqual(dummyAuthorDetails);
    });

    const req = httpMock.expectOne(
      `${environment.googleVolumeApi}?q=inauthor:test-author&maxResults=3`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyAuthorDetails);
  });

  it('should get default search books', () => {
    const dummySearchDetails: ISearchInfoDetail = {
      kind: 'books#volume',
      totalItems: 1,
      items: [
        {
          kind: 'books#volume',
          id: '12345',
          etag: 'etag12345',
          selfLink: 'https://www.googleapis.com/books/v1/volumes/12345',
          volumeInfo: {
            title: 'Sample Book Title',
            subtitle: 'Sample Book Subtitle',
            authors: ['Author One', 'Author Two'],
            publisher: 'Sample Publisher',
            publishedDate: '2023-01-01',
            description: 'This is a sample description of the book.',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '123-4567890123' },
            ],
            readingModes: {
              text: true,
              image: false,
            },
            pageCount: 350,
            printType: 'BOOK',
            categories: ['Category One', 'Category Two'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: '1.0.0',
            panelizationSummary: {
              containsEpubBubbles: false,
              containsImageBubbles: false,
            },
            imageLinks: {
              smallThumbnail: 'http://example.com/small_thumbnail.jpg',
              thumbnail: 'http://example.com/thumbnail.jpg',
            },
            language: 'en',
            previewLink: 'http://example.com/preview',
            infoLink: 'http://example.com/info',
            canonicalVolumeLink: 'http://example.com/canonical',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: true,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 8.99, currencyCode: 'USD' },
            buyLink: 'http://example.com/buy',
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true },
            pdf: { isAvailable: true },
            webReaderLink: 'http://example.com/webreader',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          searchInfo: {
            textSnippet: 'This is a sample text snippet.',
          },
        },
      ],
    };
    const params: IActiveParamsSearch = { q: 'test', maxResults: 10, startIndex: 0 };
    service.getSearchBooksDefault(params).subscribe(details => {
      expect(details).toEqual(dummySearchDetails);
    });

    const req = httpMock.expectOne(
      `${environment.googleVolumeApi}?q=test&maxResults=10&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummySearchDetails);
  });

  it('should get live search books', () => {
    const dummySearchDetails: ISearchInfoDetail = {
      kind: 'books#volume',
      totalItems: 1,
      items: [
        {
          kind: 'books#volume',
          id: '12345',
          etag: 'etag12345',
          selfLink: 'https://www.googleapis.com/books/v1/volumes/12345',
          volumeInfo: {
            title: 'Sample Book Title',
            subtitle: 'Sample Book Subtitle',
            authors: ['Author One', 'Author Two'],
            publisher: 'Sample Publisher',
            publishedDate: '2023-01-01',
            description: 'This is a sample description of the book.',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '123-4567890123' },
            ],
            readingModes: {
              text: true,
              image: false,
            },
            pageCount: 350,
            printType: 'BOOK',
            categories: ['Category One', 'Category Two'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: '1.0.0',
            panelizationSummary: {
              containsEpubBubbles: false,
              containsImageBubbles: false,
            },
            imageLinks: {
              smallThumbnail: 'http://example.com/small_thumbnail.jpg',
              thumbnail: 'http://example.com/thumbnail.jpg',
            },
            language: 'en',
            previewLink: 'http://example.com/preview',
            infoLink: 'http://example.com/info',
            canonicalVolumeLink: 'http://example.com/canonical',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: true,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 8.99, currencyCode: 'USD' },
            buyLink: 'http://example.com/buy',
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true },
            pdf: { isAvailable: true },
            webReaderLink: 'http://example.com/webreader',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          searchInfo: {
            textSnippet: 'This is a sample text snippet.',
          },
        },
      ],
    };
    service.getSearchBooksLive('test', 'title').subscribe(details => {
      expect(details).toEqual(dummySearchDetails);
    });

    const req = httpMock.expectOne(`${environment.googleVolumeApi}?q=+intitle:test`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySearchDetails);
  });

  it('should set favorite book', () => {
    service.setFavoriteBook('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.googleLibraryApi}0/addVolume?volumeId=1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should remove favorite book', () => {
    service.removeFavoriteBook('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.googleLibraryApi}0/removeVolume?volumeId=1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should return logged in status', () => {
    oAuthServiceSpy.hasValidAccessToken.and.returnValue(true);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should sign out and navigate to root', done => {
    oAuthServiceSpy.revokeTokenAndLogout.and.returnValue(Promise.resolve());
    service.signOut();
    expect(oAuthServiceSpy.revokeTokenAndLogout).toHaveBeenCalled();
    oAuthServiceSpy.revokeTokenAndLogout().then(() => {
      expect(oAuthServiceSpy.logOut).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});
