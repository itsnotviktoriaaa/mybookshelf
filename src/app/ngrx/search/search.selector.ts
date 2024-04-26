import { SearchState } from './search.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectSearchState = createFeatureSelector<SearchState>('search');
export const selectSearchBooks = createSelector(
  selectSearchState,
  (state: SearchState) => state.search
);
