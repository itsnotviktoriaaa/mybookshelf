import { Action, createReducer, on } from '@ngrx/store';
import { SearchState } from './search.state';
import { loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';

export const initialState: SearchState = {
  search: null,
};

const _searchState = createReducer(
  initialState,
  on(loadSearchBooksSuccess, (state, { data }) => ({
    ...state,
    search: data,
  })),
  on(loadSearchBooksFailure, state => ({
    ...state,
    search: null,
  }))
);

export function searchReducer(state: SearchState | undefined, action: Action) {
  return _searchState(state, action);
}
