import { DetailBookState } from './detail-book.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectDetailBookState = createFeatureSelector<DetailBookState>('detailBook');
export const selectDetailBook = createSelector(
  selectDetailBookState,
  (state: DetailBookState) => state.detailBook
);
