import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './home.actions';
import {
  homeNowReducer,
  homeReducer,
  initialStateHome,
  initialStateReadingNowBooks,
} from './home.reducer';
import { IBookItemTransformedWithTotal } from '../../modals/user';

describe('HomeReducer', () => {
  it('should return the initial state for homeReducer', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = homeReducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual(initialStateHome);
  });

  it('should handle loadRecommendedBooks', () => {
    const action = loadRecommendedBooks({ startIndex: 0 });
    const state = homeReducer(initialStateHome, action);
    expect(state.loading).toBe(true);
  });

  it('should handle loadRecommendedBooksSuccess', () => {
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
    const action = loadRecommendedBooksSuccess({ data: recommendedBooksData });
    const state = homeReducer(initialStateHome, action);

    expect(state.recommendedBooks).toEqual(recommendedBooksData);
    expect(state.loading).toBe(false);
  });

  it('should handle loadRecommendedBooksFailure', () => {
    const action = loadRecommendedBooksFailure({ error: null });
    const state = homeReducer(initialStateHome, action);

    expect(state.recommendedBooks).toBeNull();
    expect(state.loading).toBe(false);
  });
});

describe('HomeNowReducer', () => {
  it('should return the initial state for homeNowReducer', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = homeNowReducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual(initialStateReadingNowBooks);
  });

  it('should handle loadReadingNowBooks', () => {
    const action = loadReadingNowBooks({ startIndex: 0 });
    const state = homeNowReducer(initialStateReadingNowBooks, action);
    expect(state.loading).toBe(true);
  });

  it('should handle loadReadingNowBooksSuccess', () => {
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
    const action = loadReadingNowBooksSuccess({ data: readingNowBooksData });
    const state = homeNowReducer(initialStateReadingNowBooks, action);

    expect(state.readingNowBooks).toEqual(readingNowBooksData);
    expect(state.loading).toBe(false);
  });

  it('should handle loadReadingNowBooksFailure', () => {
    const action = loadReadingNowBooksFailure({ error: null });
    const state = homeNowReducer(initialStateReadingNowBooks, action);

    expect(state.readingNowBooks).toBeNull();
    expect(state.loading).toBe(false);
  });
});
