import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeNowState, HomeState } from './home.state';

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectRecommendedBooks = createSelector(selectHomeState, (state: HomeState) => state.recommendedBooks);

export const selectHomeNowState = createFeatureSelector<HomeNowState>('homeNow');

export const selectReadingNowBooks = createSelector(selectHomeNowState, (state: HomeNowState) => state.readingNowBooks);
