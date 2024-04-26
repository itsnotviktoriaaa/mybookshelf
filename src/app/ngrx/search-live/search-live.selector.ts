import { SearchLiveState } from './search-live.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectSearchLiveState = createFeatureSelector<SearchLiveState>('searchLive');
export const selectSearchLiveBooks = createSelector(
  selectSearchLiveState,
  (state: SearchLiveState) => state.searchLive
);
