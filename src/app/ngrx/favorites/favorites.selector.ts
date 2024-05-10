import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.state';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');
export const selectFavoritesBooks = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.favoritesBooks
);
export const selectLoadingOfFavoritesBooks = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.isLoading
);
