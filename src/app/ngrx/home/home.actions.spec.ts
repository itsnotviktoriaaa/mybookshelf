import {
  loadReadingNowBooks,
  loadReadingNowBooksFailure,
  loadReadingNowBooksSuccess,
  loadRecommendedBooks,
  loadRecommendedBooksFailure,
  loadRecommendedBooksSuccess,
} from './home.actions';
import { IBookItemTransformed, IBookItemTransformedWithTotal } from '../../models/personal-library';

describe('Home Actions', () => {
  const mockBookItem: IBookItemTransformed = {
    id: '1',
    thumbnail: 'https://example.com/thumbnail.jpg',
    title: 'Sample Book',
    author: ['Author A', 'Author B'],
    publishedDate: '2023-01-01',
    webReaderLink: 'https://example.com/reader',
    pageCount: 300,
    selfLink: 'https://example.com/book/1',
    categories: ['Fiction', 'Science Fiction'],
    userInfo: 'User info about the book',
    averageRating: 4.5,
    description: 'Description of the book',
  };

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
