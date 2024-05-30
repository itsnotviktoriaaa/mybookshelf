import { loadMyBooks, loadMyBooksFailure, loadMyBooksSuccess } from './';
import { initialStateMyBooks, myBooksReducer } from './';
import { IBookItemTransformed } from 'app/models';

describe('MyBooksReducer', () => {
  it('should return the initial state', () => {
    const state = myBooksReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialStateMyBooks);
  });

  it('should handle loadMyBooks', () => {
    const action = loadMyBooks();
    const state = myBooksReducer(initialStateMyBooks, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle loadMyBooksSuccess with data', () => {
    const booksData: IBookItemTransformed[] = [
      {
        id: '1',
        title: 'Book 1',
        author: ['Author 1'],
        webReaderLink: '',
        thumbnail: '',
        publishedDate: '',
      },
    ];
    const action = loadMyBooksSuccess({ data: booksData });
    const state = myBooksReducer(initialStateMyBooks, action);
    expect(state.myBooks).toEqual(booksData);
    expect(state.isLoading).toBe(false);
  });

  it('should handle loadMyBooksSuccess with empty data', () => {
    const emptyData: IBookItemTransformed[] = [];
    const action = loadMyBooksSuccess({ data: emptyData });
    const state = myBooksReducer(initialStateMyBooks, action);
    expect(state.myBooks).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('should handle loadMyBooksFailure', () => {
    const action = loadMyBooksFailure({ error: null });
    const state = myBooksReducer(initialStateMyBooks, action);
    expect(state.myBooks).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});
