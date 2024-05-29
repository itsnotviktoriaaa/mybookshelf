import {
  loadDetailBook,
  loadDetailBookFailure,
  loadDetailBookSuccess,
} from './detail-book.actions';
import { IDetailBookSmallInfo } from '../../models/personal-library';
import { detailReducer } from './detail-book.reducer';
import { DetailBookState } from './detail-book.state';
import { Action } from '@ngrx/store';

describe('Detail Book Reducer', () => {
  const initialState: DetailBookState = {
    detailBook: null,
    isLoading: false,
  };
  const mockDetailBook: IDetailBookSmallInfo = {
    id: '123',
    title: 'Test Book',
    authors: ['Author One', 'Author Two'],
    publishedDate: '2021-01-01',
    publisher: 'Test Publisher',
    averageRating: 4.5,
    accessInfo: ['EPUB'],
    thumbnail: 'http://example.com/thumbnail.jpg',
    description: 'This is a test book.',
    webReaderLink: 'http://example.com/webReaderLink',
  };

  it('should set isLoading to true on loadDetailBook', () => {
    const action = loadDetailBook({ idOfBook: '123' });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeTrue();
    expect(newState.detailBook).toBeNull();
  });

  it('should set detailBook and isLoading to false on loadDetailBookSuccess', () => {
    const action = loadDetailBookSuccess({ data: mockDetailBook });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeFalse();
    expect(newState.detailBook).toEqual(mockDetailBook);
  });

  it('should set detailBook to null and isLoading to false on loadDetailBookFailure', () => {
    const action = loadDetailBookFailure({ error: null });
    const newState = detailReducer(initialState, action);
    expect(newState.isLoading).toBeFalse();
    expect(newState.detailBook).toBeNull();
  });

  it('should return the current state on unknown action', () => {
    const unknownAction = {} as Action;
    const newState = detailReducer(initialState, unknownAction);
    expect(newState).toEqual(initialState);
  });
});
