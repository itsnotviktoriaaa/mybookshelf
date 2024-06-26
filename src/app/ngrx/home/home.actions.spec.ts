import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './';
import { IBookItemTransformedWithTotal } from 'app/models';
import { mockBookItem } from 'app/ngrx';

describe('Home Actions', () => {
  const mockBookItemWithTotal: IBookItemTransformedWithTotal = {
    items: [mockBookItem],
    totalItems: 1,
  };

  it('should create loadRecommendedBooks action', () => {
    const startIndex = 0;
    const action = loadRecommendedBooks({ startIndex });

    expect(action.type).toBe('[Book] Load Recommended Books');
    expect(action.startIndex).toBe(startIndex);
  });

  it('should create loadRecommendedBooksSuccess action', () => {
    const data: IBookItemTransformedWithTotal = mockBookItemWithTotal;
    const action = loadRecommendedBooksSuccess({ data });

    expect(action.type).toBe('[Book] Load Recommended Books Success');
    expect(action.data).toEqual(data);
  });

  it('should create loadRecommendedBooksFailure action', () => {
    const error = null;
    const action = loadRecommendedBooksFailure({ error });

    expect(action.type).toBe('[Book] Load Recommended Books Failure');
    expect(action.error).toBeNull();
  });

  it('should create loadReadingNowBooks action', () => {
    const startIndex = 0;
    const action = loadReadingNowBooks({ startIndex });

    expect(action.type).toBe('[Book] Load Reading Now Books');
    expect(action.startIndex).toBe(startIndex);
  });

  it('should create loadReadingNowBooksSuccess action', () => {
    const data: IBookItemTransformedWithTotal = mockBookItemWithTotal;
    const action = loadReadingNowBooksSuccess({ data });

    expect(action.type).toBe('[Book] Load Reading Now Books Success');
    expect(action.data).toEqual(data);
  });

  it('should create loadReadingNowBooksFailure action', () => {
    const error = null;
    const action = loadReadingNowBooksFailure({ error });

    expect(action.type).toBe('[Book] Load Reading Now Books Failure');
    expect(action.error).toBeNull();
  });
});
