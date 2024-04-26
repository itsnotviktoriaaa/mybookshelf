import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchState } from './search.state';

export const selectSearchState = createFeatureSelector<SearchState>('search');
export const selectSearchBooks = createSelector(
  selectSearchState,
  (state: SearchState) => state.search
);
