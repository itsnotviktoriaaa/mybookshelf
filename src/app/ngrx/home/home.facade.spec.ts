import {
  selectLoadingOfReadingNowBooks,
  selectLoadingOfRecommendedBooks,
  selectReadingNowBooks,
  selectRecommendedBooks,
} from './';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { loadReadingNowBooks, loadRecommendedBooks } from './';
import { mockBookItemWithTotalHome } from 'app/ngrx';
import { TestBed } from '@angular/core/testing';
import { HomeFacade } from './';

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
    store.overrideSelector(selectRecommendedBooks, mockBookItemWithTotalHome);

    facade.getRecommendedBooks().subscribe(data => {
      expect(data).toEqual(mockBookItemWithTotalHome);
    });
  });

  it('should return selected reading now books', () => {
    store.overrideSelector(selectReadingNowBooks, mockBookItemWithTotalHome);

    facade.getReadingNowBooks().subscribe(data => {
      expect(data).toEqual(mockBookItemWithTotalHome);
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
