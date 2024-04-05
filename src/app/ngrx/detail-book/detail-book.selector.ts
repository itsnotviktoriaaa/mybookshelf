import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DetailBookState } from './detail-book.state';

export const selectDetailBookState = createFeatureSelector<DetailBookState>('detailBook');
export const selectDetailBook = createSelector(selectDetailBookState, (state: DetailBookState) => state.detailBook);
