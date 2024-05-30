import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DetailBookState } from './';

export const selectDetailBookState = createFeatureSelector<DetailBookState>('detailBook');
export const selectDetailBook = createSelector(
  selectDetailBookState,
  (state: DetailBookState) => state.detailBook
);

export const selectLoadingOfDetailBook = createSelector(
  selectDetailBookState,
  (state: DetailBookState) => state.isLoading
);
