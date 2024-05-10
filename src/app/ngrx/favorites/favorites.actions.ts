import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../modals/user';
import { createAction, props } from '@ngrx/store';

export const loadFavoritesBooks = createAction(
  '[Favorites] Load Favorites Books',
  props<{ params: IActiveParamsSearch }>()
);
export const loadFavoritesBooksSuccess = createAction(
  '[Favorites] Load Favorites Books Success',
  props<{ data: IBookItemTransformedWithTotal }>()
);
export const loadFavoritesBooksFailure = createAction(
  '[Favorites] Load Favorites Books Failure',
  props<{ error: null }>()
);

export const startLoading = createAction('[Favorites] Start Loading');
export const stopLoading = createAction('[Favorites] Stop Loading');

export const removeFromFavoritesBooks = createAction(
  '[Favorites] Remove Favorites Book',
  props<{ bookId: string }>()
);
export const removeFromFavoritesBooksSuccess = createAction(
  '[Favorites] Remove Favorites Book',
  props<{ bookId: string }>()
);
export const removeFromFavoritesBooksFailure = createAction(
  '[Favorites] Remove Favorites Book',
  props<{ error: null }>()
);
