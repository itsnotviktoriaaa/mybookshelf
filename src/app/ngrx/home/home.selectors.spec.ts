import {
  selectHomeNowState,
  selectHomeState,
  selectLoadingOfReadingNowBooks,
  selectLoadingOfRecommendedBooks,
  selectReadingNowBooks,
  selectRecommendedBooks,
} from './home.selectors';
import { IBookItemTransformedWithTotal } from '../../models/personal-library';
import { HomeNowState, HomeState } from './home.state';

describe('HomeSelectors', () => {
  const recommendedBooksData: IBookItemTransformedWithTotal = {
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

  const homeState: HomeState = {
    recommendedBooks: recommendedBooksData,
    loading: true,
  };

  const readingNowBooksData: IBookItemTransformedWithTotal = {
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

  const homeNowState: HomeNowState = {
    readingNowBooks: readingNowBooksData,
    loading: false,
  };

  it('should select the home state', () => {
    const result = selectHomeState.projector(homeState);
    expect(result).toEqual(homeState);
  });

  it('should select recommended books', () => {
    const result = selectRecommendedBooks.projector(homeState);
    expect(result).toEqual(recommendedBooksData);
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
    expect(result).toEqual(readingNowBooksData);
  });

  it('should select loading of reading now books', () => {
    const result = selectLoadingOfReadingNowBooks.projector(homeNowState);
    expect(result).toBe(false);
  });
});
