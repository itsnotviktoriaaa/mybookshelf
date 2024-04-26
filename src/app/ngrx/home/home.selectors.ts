import { HomeNowState, HomeState } from './home.state';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectRecommendedBooks = createSelector(
  selectHomeState,
  (state: HomeState) => state.recommendedBooks
);
export const selectLoading = createSelector(selectHomeState, (state: HomeState) => state.loading);

export const selectHomeNowState = createFeatureSelector<HomeNowState>('homeNow');

export const selectReadingNowBooks = createSelector(
  selectHomeNowState,
  (state: HomeNowState) => state.readingNowBooks
);
