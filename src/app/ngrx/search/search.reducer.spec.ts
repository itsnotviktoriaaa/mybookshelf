import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { ISearch, ISearchDetail } from '../../models/user';
import { searchReducer } from './search.reducer';
import { SearchState } from './search.state';

describe('SearchReducer', () => {
  const initialState: SearchState = {
    search: null,
    isLoading: false,
  };

  const mockSearchDetail1: ISearchDetail = {
    id: '1',
    title: 'Book Title 1',
    authors: ['Author 1', 'Author 2'],
    publishedDate: '2022-01-01',
    publisher: 'Publisher 1',
    thumbnail: 'thumbnail1.jpg',
    categories: ['Category 1', 'Category 2'],
    pageCount: 200,
  };

  const mockSearchDetail2: ISearchDetail = {
    id: '2',
    title: 'Book Title 2',
    authors: ['Author 3'],
    publishedDate: '2022-02-01',
    publisher: 'Publisher 2',
    thumbnail: 'thumbnail2.jpg',
    categories: ['Category 3'],
    pageCount: 300,
  };

  const mockSearch: ISearch = {
    totalItems: 2,
    items: [mockSearchDetail1, mockSearchDetail2],
  };

  it('should set isLoading to true on loadSearchBooks action', () => {
    const action = loadSearchBooks({
      params: {
        q: 'angular',
        maxResults: 40,
        startIndex: 0,
      },
    });
    const state = searchReducer(initialState, action);
    expect(state.isLoading).toEqual(true);
  });

  it('should set search data and isLoading to false on loadSearchBooksSuccess action', () => {
    const action = loadSearchBooksSuccess({ data: mockSearch });
    const state = searchReducer(initialState, action);
    expect(state.search).toEqual(mockSearch);
    expect(state.isLoading).toEqual(false);
  });

  it('should set search to null and isLoading to false on loadSearchBooksFailure action', () => {
    const action = loadSearchBooksFailure({ error: null });
    const state = searchReducer(initialState, action);
    expect(state.search).toBeNull();
    expect(state.isLoading).toEqual(false);
  });

  it('should return the initial state if the action is not recognized', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = searchReducer(initialState, unknownAction as any);
    expect(state).toEqual(initialState);
  });
});
