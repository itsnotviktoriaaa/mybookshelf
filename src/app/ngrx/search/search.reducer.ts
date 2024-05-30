import { loadSearchBooks, loadSearchBooksFailure, loadSearchBooksSuccess } from './';
import { Action, createReducer, on } from '@ngrx/store';
import { SearchState } from './';

export const initialStateSearch: SearchState = {
  search: null,
  isLoading: false,
};

const _searchState = createReducer(
  initialStateSearch,
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
