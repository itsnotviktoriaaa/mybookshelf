import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { ISearchInfoDetail } from '../../models/personal-library';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { SearchEffects } from './search.effects';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from '../../core';

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
    const searchInfoDetail: ISearchInfoDetail = {
      kind: 'books#volume',
      totalItems: 2,
      items: [
        {
          kind: 'books#volume',
          id: '1',
          etag: 'etag1',
          selfLink: 'link1',
          volumeInfo: {
            title: 'Book Title 1',
            subtitle: 'Subtitle 1',
            authors: ['Author 1'],
            publisher: 'Publisher 1',
            publishedDate: '2022-01-01',
            description: 'Description 1',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '1234567890' },
              { type: 'ISBN_13', identifier: '123-1234567890' },
            ],
            readingModes: { text: true, image: true },
            pageCount: 100,
            printType: 'BOOK',
            categories: ['Category 1', 'Category 2'],
            maturityRating: 'MATURE',
            allowAnonLogging: false,
            contentVersion: 'preview-1.0.0',
            panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
            imageLinks: { smallThumbnail: 'smallThumbnail1', thumbnail: 'thumbnail1' },
            language: 'en',
            previewLink: 'previewLink1',
            infoLink: 'infoLink1',
            canonicalVolumeLink: 'canonicalLink1',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: true,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 7.99, currencyCode: 'USD' },
            buyLink: 'buyLink1',
          },
          accessInfo: {
            country: 'US',
            viewability: 'PARTIAL',
            embeddable: true,
            publicDomain: false,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: true },
            pdf: { isAvailable: true },
            webReaderLink: 'webReaderLink1',
            accessViewStatus: 'SAMPLE',
            quoteSharingAllowed: true,
          },
          searchInfo: { textSnippet: 'Text Snippet 1' },
        },
        {
          kind: 'books#volume',
          id: '2',
          etag: 'etag2',
          selfLink: 'link2',
          volumeInfo: {
            title: 'Book Title 2',
            subtitle: 'Subtitle 2',
            authors: ['Author 2'],
            publisher: 'Publisher 2',
            publishedDate: '2022-02-02',
            description: 'Description 2',
            industryIdentifiers: [
              { type: 'ISBN_10', identifier: '0987654321' },
              { type: 'ISBN_13', identifier: '987-0987654321' },
            ],
            readingModes: { text: true, image: true },
            pageCount: 200,
            printType: 'BOOK',
            categories: ['Category 3', 'Category 4'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: 'preview-2.0.0',
            panelizationSummary: { containsEpubBubbles: true, containsImageBubbles: true },
            imageLinks: { smallThumbnail: 'smallThumbnail2', thumbnail: 'thumbnail2' },
            language: 'en',
            previewLink: 'previewLink2',
            infoLink: 'infoLink2',
            canonicalVolumeLink: 'canonicalLink2',
          },
          saleInfo: {
            country: 'US',
            saleability: 'FOR_SALE',
            isEbook: false,
            listPrice: { amount: 9.99, currencyCode: 'USD' },
            retailPrice: { amount: 7.99, currencyCode: 'USD' },
            buyLink: 'https://example.com/buy',
          },
          accessInfo: {
            country: 'US',
            viewability: 'FULL',
            embeddable: true,
            publicDomain: true,
            textToSpeechPermission: 'ALLOWED',
            epub: { isAvailable: false },
            pdf: { isAvailable: false },
            webReaderLink: 'webReaderLink2',
            accessViewStatus: 'FULL_PUBLIC_DOMAIN',
            quoteSharingAllowed: false,
          },
          searchInfo: { textSnippet: 'Text Snippet 2' },
        },
      ],
    };
    const action = loadSearchBooks({
      params: {
        q: 'angular',
        maxResults: 40,
        startIndex: 0,
      },
    });
    const successAction = loadSearchBooksSuccess({
      data: {
        totalItems: searchInfoDetail.totalItems,
        items: [
          {
            id: '1',
            thumbnail: searchInfoDetail.items[0].volumeInfo.imageLinks.thumbnail,
            title: searchInfoDetail.items[0].volumeInfo.title,
            authors: searchInfoDetail.items[0].volumeInfo.authors,
            publishedDate: searchInfoDetail.items[0].volumeInfo.publishedDate,
            publisher: searchInfoDetail.items[0].volumeInfo.publisher,
            categories: searchInfoDetail.items[0].volumeInfo.categories,
            pageCount: searchInfoDetail.items[0].volumeInfo.pageCount,
          },
          {
            id: '2',
            thumbnail: searchInfoDetail.items[1].volumeInfo.imageLinks.thumbnail,
            title: searchInfoDetail.items[1].volumeInfo.title,
            authors: searchInfoDetail.items[1].volumeInfo.authors,
            publishedDate: searchInfoDetail.items[1].volumeInfo.publishedDate,
            publisher: searchInfoDetail.items[1].volumeInfo.publisher,
            categories: searchInfoDetail.items[1].volumeInfo.categories,
            pageCount: searchInfoDetail.items[1].volumeInfo.pageCount,
          },
        ],
      },
    });

    actions$ = of(action);
    googleApiService.getSearchBooksDefault.and.returnValue(of(searchInfoDetail));

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
