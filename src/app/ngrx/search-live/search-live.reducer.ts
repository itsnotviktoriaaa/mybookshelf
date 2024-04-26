import { loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess } from './search-live.actions';
import { SearchLiveState } from './search-live.state';
import { Action, createReducer, on } from '@ngrx/store';

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
  })
);

export function searchLiveReducer(state: SearchLiveState | undefined, action: Action) {
  return _searchLiveState(state, action);
}
