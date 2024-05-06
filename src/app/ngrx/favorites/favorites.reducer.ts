import {
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooksSuccess,
} from './favorites.actions';
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
  })),
  on(removeFromFavoritesBooksSuccess, (state, { bookId }) => {
    if (!state.favoritesBooks) {
      return state;
    }

    const filteredItems = state.favoritesBooks.items.filter(
      favoritesBook => favoritesBook.id !== bookId
    );
    const totalItems = filteredItems.length;
    return {
      ...state,
      favoritesBooks: {
        items: filteredItems,
        totalItems: totalItems,
      },
    };
  })
);

export function favoritesReducer(state: FavoritesState | undefined, action: Action) {
  return _favoritesState(state, action);
}
