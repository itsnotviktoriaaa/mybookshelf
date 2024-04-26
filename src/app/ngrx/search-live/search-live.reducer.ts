import {
  loadSearchLiveBooksFailure,
  loadSearchLiveBooksSuccess,
  resetSearchLiveBooks,
} from './search-live.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { SearchLiveState } from './search-live.state';

export const initialState: SearchLiveState = {
  searchLive: null,
};

const _searchLiveState = createReducer(
  initialState,
  on(loadSearchLiveBooksSuccess, (state, { data }) => {
    return {
      ...state,
      searchLive: data,
    };
  }),
  on(loadSearchLiveBooksFailure, state => {
    return {
      ...state,
      searchLive: null,
    };
  }),
  on(resetSearchLiveBooks, (state, { data }) => ({
    ...state,
    searchLive: data,
  }))
);

export function searchLiveReducer(state: SearchLiveState | undefined, action: Action) {
  return _searchLiveState(state, action);
}
