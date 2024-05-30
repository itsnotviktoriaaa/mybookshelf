import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { searchReducer } from './search.reducer';
import { SearchState } from './search.state';
import { mockSearch } from 'app/ngrx';

describe('SearchReducer', () => {
  const initialState: SearchState = {
    search: null,
    isLoading: false,
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
