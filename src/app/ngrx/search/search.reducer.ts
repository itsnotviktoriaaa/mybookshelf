import { loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { SearchState } from './search.state';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: SearchState = {
  search: null,
};

const _searchState = createReducer(
  initialState,
  on(loadSearchBooksSuccess, (state, { data }) => {
    return {
      ...state,
      search: data,
    };
  }),
  on(loadSearchBooksFailure, state => {
    return {
      ...state,
      search: null,
    };
  })
);

export function searchReducer(state: SearchState | undefined, action: Action) {
  return _searchState(state, action);
}
