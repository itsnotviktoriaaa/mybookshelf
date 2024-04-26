import { loadFavoritesBooksFailure, loadFavoritesBooksSuccess } from './favorites.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { FavoritesState } from './favorites.state';

export const initialState: FavoritesState = {
  favoritesBooks: null,
};

const _favoritesState = createReducer(
  initialState,
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
