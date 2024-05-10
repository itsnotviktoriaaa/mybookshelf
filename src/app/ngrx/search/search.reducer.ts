import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './search.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { SearchState } from './search.state';

export const initialState: SearchState = {
  search: null,
  isLoading: false,
};

const _searchState = createReducer(
  initialState,
  on(loadSearchBooks, state => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(loadSearchBooksSuccess, (state, { data }) => {
    return {
      ...state,
      search: data,
      isLoading: false,
    };
  }),
  on(loadSearchBooksFailure, state => {
    return {
      ...state,
      search: null,
      isLoading: false,
    };
  })
);

export function searchReducer(state: SearchState | undefined, action: Action) {
  return _searchState(state, action);
}
