import { createAction, props } from '@ngrx/store';
import { arrayFromBookItemTransformedInterface } from 'types/';

export const loadFavoritesBooks = createAction('[Favorites] Load Favorites Books');
export const loadFavoritesBooksSuccess = createAction('[Favorites] Load Favorites Books Success', props<{ data: arrayFromBookItemTransformedInterface }>());
export const loadFavoritesBooksFailure = createAction('[Favorites] Load Favorites Books Failure', props<{ error: null }>());
