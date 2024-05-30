import {
  loadMyBooks,
  loadMyBooksFailure,
  loadMyBooksSuccess,
  removeFromMyBooks,
  removeFromMyBooksFailure,
  removeFromMyBooksSuccess,
} from './my-books.actions';
import { IBookItemTransformed } from 'app/models';
import { mockBookItem } from 'app/ngrx';

describe('MyBooks Actions', () => {
  it('should create loadMyBooks action', () => {
    const action = loadMyBooks();
    expect(action.type).toBe('[MyBooks] Load My Books');
  });

  it('should create loadMyBooksSuccess action', () => {
    const payload: IBookItemTransformed[] = [mockBookItem];
    const action = loadMyBooksSuccess({ data: payload });
    expect(action.type).toBe('[MyBooks] Load My Books Success');
    expect(action.data).toEqual(payload);
  });

  it('should create loadMyBooksFailure action', () => {
    const action = loadMyBooksFailure({ error: null });
    expect(action.type).toBe('[MyBooks] Load My Books Failure');
    expect(action.error).toBeNull();
  });

  it('should create removeFromMyBooks action', () => {
    const dummyBookId = '1';
    const action = removeFromMyBooks({ id: dummyBookId, webReaderLink: '', thumbnail: '' });
    expect(action.type).toBe('[MyBooks] Remove My Book');
    expect(action.id).toBe(dummyBookId);
    expect(action.webReaderLink).toBe('');
    expect(action.thumbnail).toBe('');
  });

  it('should create removeFromMyBooksSuccess action', () => {
    const dummyBookId = '1';
    const action = removeFromMyBooksSuccess({ bookId: dummyBookId });
    expect(action.type).toBe('[MyBooks] Remove My Book Success');
    expect(action.bookId).toBe(dummyBookId);
  });

  it('should create removeFromMyBooksFailure action', () => {
    const action = removeFromMyBooksFailure({ error: null });
    expect(action.type).toBe('[MyBooks] Remove My Book Failure');
    expect(action.error).toBeNull();
  });
});
