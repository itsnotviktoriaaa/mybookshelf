import { loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess, resetSearchLiveBooks } from './';
import { Action, createReducer, on } from '@ngrx/store';
import { SearchLiveState } from './';

export const initialStateSearchLive: SearchLiveState = {
  searchLive: null,
};

const _searchLiveState = createReducer(
  initialStateSearchLive,
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
