import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeNowState, HomeState } from './';

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectRecommendedBooks = createSelector(
  selectHomeState,
  (state: HomeState) => state.recommendedBooks
);
export const selectLoadingOfRecommendedBooks = createSelector(
  selectHomeState,
  (state: HomeState) => state.loading
);

export const selectHomeNowState = createFeatureSelector<HomeNowState>('homeNow');

export const selectReadingNowBooks = createSelector(
  selectHomeNowState,
  (state: HomeNowState) => state.readingNowBooks
);

export const selectLoadingOfReadingNowBooks = createSelector(
  selectHomeNowState,
  (state: HomeNowState) => state.loading
);
