import { FavoritesState } from './favorites.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');
export const selectFavoritesBooks = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.favoritesBooks
);
