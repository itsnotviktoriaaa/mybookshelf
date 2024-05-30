import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchState } from './';

export const selectSearchState = createFeatureSelector<SearchState>('search');
export const selectSearchBooks = createSelector(
  selectSearchState,
  (state: SearchState) => state.search
);

export const selectLoadingOfSearchBooks = createSelector(
  selectSearchState,
  (state: SearchState) => state.isLoading
);
