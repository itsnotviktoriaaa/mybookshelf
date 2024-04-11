import { FavoritesState } from './';
import { Action, createReducer, on } from '@ngrx/store';
import { loadFavoritesBooksFailure, loadFavoritesBooksSuccess } from './';

export const initialStateFavorites: FavoritesState = {
  favoritesBooks: null,
};

const _favoritesState = createReducer(
  initialStateFavorites,
  on(loadFavoritesBooksSuccess, (state, { data }) => ({
    ...state,
    favoritesBooks: data,
  })),
  on(loadFavoritesBooksFailure, state => ({
    ...state,
    favoritesBooks: null,
  }))
);

export function favoritesReducer(state: FavoritesState | undefined, action: Action) {
  return _favoritesState(state, action);
}
