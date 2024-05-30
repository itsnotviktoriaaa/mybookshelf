import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooksSuccess,
} from './';
import { Action, createReducer, on } from '@ngrx/store';
import { FavoritesState } from './';

export const initialStateFavorite: FavoritesState = {
  favoritesBooks: null,
  isLoading: false,
};

const _favoritesState = createReducer(
  initialStateFavorite,
  on(loadFavoritesBooks, state => ({
    ...state,
    isLoading: true,
  })),
  on(loadFavoritesBooksSuccess, (state, { data }) => ({
    ...state,
    favoritesBooks: data,
    isLoading: false,
  })),
  on(loadFavoritesBooksFailure, state => ({
    ...state,
    favoritesBooks: null,
    isLoading: false,
  })),
  on(removeFromFavoritesBooksSuccess, (state, { bookId }) => {
    if (!state.favoritesBooks) {
      return state;
    }

    if (
      state &&
      state.favoritesBooks &&
      state.favoritesBooks.items &&
      state.favoritesBooks.items.length === 1
    ) {
      return { ...state, favoritesBooks: null };
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
