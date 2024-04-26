import { createAction, props } from '@ngrx/store';
import { ActiveParamsSearchType, arrayFromBookItemTransformedInterface } from '../../modals/user';

export const loadFavoritesBooks = createAction(
  '[Favorites] Load Favorites Books',
  props<{ params: ActiveParamsSearchType }>()
);
export const loadFavoritesBooksSuccess = createAction(
  '[Favorites] Load Favorites Books Success',
  props<{ data: arrayFromBookItemTransformedInterface }>()
);
export const loadFavoritesBooksFailure = createAction(
  '[Favorites] Load Favorites Books Failure',
  props<{ error: null }>()
);
