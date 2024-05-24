import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchLiveState } from './';

export const selectSearchLiveState = createFeatureSelector<SearchLiveState>('searchLive');
export const selectSearchLiveBooks = createSelector(
  selectSearchLiveState,
  (state: SearchLiveState) => state.searchLive
);
