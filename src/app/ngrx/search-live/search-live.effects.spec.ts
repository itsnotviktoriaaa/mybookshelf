import { loadSearchLiveBooks, loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess } from './';
import { provideMockActions } from '@ngrx/effects/testing';
import { ISearchInfoDetail } from '../../models/user';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from '../../core';
import { SearchLiveEffects } from './';

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
    const mockSearchInfoDetail: ISearchInfoDetail = {
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

    actions$ = of(action);
    googleApiService.getSearchBooksLive.and.returnValue(of(mockSearchInfoDetail));

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
