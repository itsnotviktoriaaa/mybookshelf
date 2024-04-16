import { createAction, props } from '@ngrx/store';
import { SearchInterface } from '../../types/user';

export const loadSearchBooks = createAction('[Search] Load Search Books');
export const loadSearchBooksSuccess = createAction(
  '[Search] Load Search Books Success',
  props<{ data: SearchInterface }>()
);
export const loadSearchBooksFailure = createAction(
  '[Search] Load Search Books Failure',
  props<{ error: null }>()
);
