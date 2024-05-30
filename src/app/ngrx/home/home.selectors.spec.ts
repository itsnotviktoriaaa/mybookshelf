import {
  selectHomeNowState,
  selectHomeState,
  selectLoadingOfReadingNowBooks,
  selectLoadingOfRecommendedBooks,
  selectReadingNowBooks,
  selectRecommendedBooks,
} from './';
import { mockBookItemWithTotalHome } from 'app/ngrx';
import { HomeNowState, HomeState } from './';

describe('HomeSelectors', () => {
  const homeState: HomeState = {
    recommendedBooks: mockBookItemWithTotalHome,
    loading: true,
  };

  const homeNowState: HomeNowState = {
    readingNowBooks: mockBookItemWithTotalHome,
    loading: false,
  };

  it('should select the home state', () => {
    const result = selectHomeState.projector(homeState);
    expect(result).toEqual(homeState);
  });

  it('should select recommended books', () => {
    const result = selectRecommendedBooks.projector(homeState);
    expect(result).toEqual(mockBookItemWithTotalHome);
  });

  it('should select loading of recommended books', () => {
    const result = selectLoadingOfRecommendedBooks.projector(homeState);
    expect(result).toBe(true);
  });

  it('should select the home now state', () => {
    const result = selectHomeNowState.projector(homeNowState);
    expect(result).toEqual(homeNowState);
  });

  it('should select reading now books', () => {
    const result = selectReadingNowBooks.projector(homeNowState);
    expect(result).toEqual(mockBookItemWithTotalHome);
  });

  it('should select loading of reading now books', () => {
    const result = selectLoadingOfReadingNowBooks.projector(homeNowState);
    expect(result).toBe(false);
  });
});
