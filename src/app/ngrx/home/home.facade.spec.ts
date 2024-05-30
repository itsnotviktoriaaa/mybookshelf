import {
  selectLoadingOfReadingNowBooks,
  selectLoadingOfRecommendedBooks,
  selectReadingNowBooks,
  selectRecommendedBooks,
} from './home.selectors';
import { loadReadingNowBooks, loadRecommendedBooks } from './home.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IBookItemTransformedWithTotal } from 'app/models';
import { TestBed } from '@angular/core/testing';
import { HomeFacade } from './home.facade';

describe('HomeFacade', () => {
  let facade: HomeFacade;
  let store: MockStore;
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(HomeFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadRecommendedBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const startIndex = 0;

    facade.loadRecommendedBooks(startIndex);
    expect(dispatchSpy).toHaveBeenCalledWith(loadRecommendedBooks({ startIndex }));
  });

  it('should dispatch loadReadingNowBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const startIndex = 0;

    facade.loadReadingNowBooks(startIndex);
    expect(dispatchSpy).toHaveBeenCalledWith(loadReadingNowBooks({ startIndex }));
  });

  it('should return selected recommended books', () => {
    const expectedData: IBookItemTransformedWithTotal = {
      items: [
        {
          id: '1',
          thumbnail: 'url',
          title: 'title',
          author: ['Author'],
          publishedDate: '2023',
          webReaderLink: 'link',
          pageCount: 100,
        },
      ],
      totalItems: 1,
    };
    store.overrideSelector(selectRecommendedBooks, expectedData);

    facade.getRecommendedBooks().subscribe(data => {
      expect(data).toEqual(expectedData);
    });
  });

  it('should return selected reading now books', () => {
    const expectedData: IBookItemTransformedWithTotal = {
      items: [
        {
          id: '1',
          thumbnail: 'url',
          title: 'title',
          author: ['Author'],
          publishedDate: '2023',
          webReaderLink: 'link',
          pageCount: 100,
        },
      ],
      totalItems: 1,
    };
    store.overrideSelector(selectReadingNowBooks, expectedData);

    facade.getReadingNowBooks().subscribe(data => {
      expect(data).toEqual(expectedData);
    });
  });

  it('should return loading state of recommended books', () => {
    const expectedLoading = true;
    store.overrideSelector(selectLoadingOfRecommendedBooks, expectedLoading);

    facade.getLoadingOfRecommendedBooks().subscribe(isLoading => {
      expect(isLoading).toBe(expectedLoading);
    });
  });

  it('should return loading state of reading now books', () => {
    const expectedLoading = true;
    store.overrideSelector(selectLoadingOfReadingNowBooks, expectedLoading);

    facade.getLoadingOfReadingNowBooks().subscribe(isLoading => {
      expect(isLoading).toBe(expectedLoading);
    });
  });
});
