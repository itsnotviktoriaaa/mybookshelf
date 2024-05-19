import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { searchReducer } from './search.reducer';
import { SearchState } from './search.state';
import { Action } from '@ngrx/store';

describe('SearchReducer', () => {
  const initialState: SearchState = {
    search: null,
    isLoading: false,
  };

  it('should set isLoading to true when loadSearchBooks action is dispatched', () => {
    const action = loadSearchBooks({ params: { q: 'test', maxResults: 10, startIndex: 0 } });
    const state = searchReducer(initialState, action);
    expect(state.isLoading).toEqual(true);
  });

  it('should set search and isLoading to false when loadSearchBooksSuccess action is dispatched', () => {
    const action = loadSearchBooksSuccess({ data: { totalItems: 2, items: [] } });
    const state = searchReducer(initialState, action);
    expect(state.isLoading).toEqual(false);
    expect(state.search).toEqual({ totalItems: 2, items: [] });
  });

  it('should set search and isLoading to false when loadSearchBooksFailure action is dispatched', () => {
    const action = loadSearchBooksFailure({ error: null });
    const state = searchReducer(initialState, action);
    expect(state.isLoading).toEqual(false);
    expect(state.search).toBeNull();
  });

  it('should return the initial state when an unknown action is dispatched', () => {
    const action = {} as Action;
    const state = searchReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});
