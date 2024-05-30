import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './';
import { homeNowReducer, homeReducer, initialStateHome, initialStateReadingNowBooks } from './';
import { mockBookItemWithTotalHome } from 'app/ngrx';

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
    const action = loadRecommendedBooksSuccess({ data: mockBookItemWithTotalHome });
    const state = homeReducer(initialStateHome, action);

    expect(state.recommendedBooks).toEqual(mockBookItemWithTotalHome);
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
    const action = loadReadingNowBooksSuccess({ data: mockBookItemWithTotalHome });
    const state = homeNowReducer(initialStateReadingNowBooks, action);

    expect(state.readingNowBooks).toEqual(mockBookItemWithTotalHome);
    expect(state.loading).toBe(false);
  });

  it('should handle loadReadingNowBooksFailure', () => {
    const action = loadReadingNowBooksFailure({ error: null });
    const state = homeNowReducer(initialStateReadingNowBooks, action);

    expect(state.readingNowBooks).toBeNull();
    expect(state.loading).toBe(false);
  });
});
