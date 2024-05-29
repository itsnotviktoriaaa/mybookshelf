import {
  IActiveParamsSearch,
  IBook,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
} from '../../models/user';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { FavoriteService } from './favorite.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { TestBed } from '@angular/core/testing';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let httpMock: HttpTestingController;
  let oAuthServiceSpy: jasmine.SpyObj<OAuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('OAuthService', ['getAccessToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoriteService, { provide: OAuthService, useValue: spy }],
    });

    service = TestBed.inject(FavoriteService);
    httpMock = TestBed.inject(HttpTestingController);
    oAuthServiceSpy = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
    oAuthServiceSpy.getAccessToken.and.returnValue('fake-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should build query string correctly when params.q is provided', () => {
    const params: IActiveParamsSearch = { maxResults: 40, startIndex: 0, q: 'test' };
    service.getFavorites(params).subscribe();

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}0/volumes?q=test&maxResults=40&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('should build query string correctly when params.q is not provided', () => {
    const params: IActiveParamsSearch = { q: '', maxResults: 40, startIndex: 0 };
    service.getFavorites(params).subscribe();

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}0/volumes?maxResults=40&startIndex=0`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('should transform and return the book data correctly', () => {
    const params: IActiveParamsSearch = { q: 'test', maxResults: 40, startIndex: 0 };
    const mockBookResponse: IBook = {
      kind: 'books#volumes',
      totalItems: 1,
      items: [
        {
          id: '1',
          kind: 'books#volume',
          etag: 'etag',
          selfLink: 'selfLink',
          volumeInfo: {
            title: 'Book Title',
            authors: ['Author 1'],
            publisher: 'Publisher',
            publishedDate: '2020-01-01',
            description: 'Description of the book',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '1234567890123' },
            ],
            readingModes: { text: true, image: false },
            pageCount: 300,
            printType: 'BOOK',
            categories: ['Category 1'],
            averageRating: 4.5,
            ratingsCount: 10,
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: false,
            contentVersion: '1.0.0',
            panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
            imageLinks: { smallThumbnail: 'smallThumbnail-url', thumbnail: 'thumbnail-url' },
            previewLink: 'previewLink',
            infoLink: 'infoLink',
            canonicalVolumeLink: 'canonicalVolumeLink',
          },
          saleInfo: {
            country: 'US',
            saleability: 'NOT_FOR_SALE',
            isEbook: false,
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true, acsTokenLink: 'acsTokenLink' },
            pdf: { isAvailable: false },
            webReaderLink: 'webReaderLink',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          layerInfo: {
            layers: [{ layerId: 'layerId', volumeAnnotationsVersion: '1.0.0' }],
          },
          userInfo: {
            updated: '2021-01-01',
          },
        },
      ],
    };

    service.getFavorites(params).subscribe((result: IBookItemTransformedWithTotal) => {
      expect(result.items.length).toBe(1);
      expect(result.items[0].title).toBe('Book Title');
      expect(result.totalItems).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}0/volumes?q=test&maxResults=40&startIndex=0`
    );
    req.flush(mockBookResponse);
  });

  it('should filter unique books correctly', () => {
    const books: IBookItemTransformed[] = [
      {
        id: '1',
        thumbnail: 'url',
        title: 'Title 1',
        author: ['Author 1'],
        publishedDate: '2020',
        webReaderLink: 'link',
        pageCount: 300,
        selfLink: 'self',
        categories: ['Category'],
        userInfo: 'user',
        averageRating: 4,
      },
      {
        id: '1',
        thumbnail: 'url',
        title: 'Title 1',
        author: ['Author 1'],
        publishedDate: '2020',
        webReaderLink: 'link',
        pageCount: 300,
        selfLink: 'self',
        categories: ['Category'],
        userInfo: 'user',
        averageRating: 4,
      },
      {
        id: '2',
        thumbnail: 'url',
        title: 'Title 2',
        author: ['Author 2'],
        publishedDate: '2021',
        webReaderLink: 'link',
        pageCount: 200,
        selfLink: 'self',
        categories: ['Category'],
        userInfo: 'user',
        averageRating: 5,
      },
    ];

    const uniqueBooks = service.filterUniqueBooks(books);
    expect(uniqueBooks.length).toBe(2);
  });

  it('should handle error correctly', () => {
    const params: IActiveParamsSearch = { q: 'test', maxResults: 40, startIndex: 0 };

    service.getFavorites(params).subscribe(
      () => fail('expected an error, not books'),
      error => expect(error).toBeTruthy()
    );

    const req = httpMock.expectOne(
      `${environment.googleLibraryApi}0/volumes?q=test&maxResults=40&startIndex=0`
    );
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
  });

  it('should set Authorization header correctly', () => {
    const headers = service['authHeader']();
    expect(headers.get('Authorization')).toBe('Bearer fake-token');
    expect(headers.get('Content-Type')).toBe('application/json');
  });
});
