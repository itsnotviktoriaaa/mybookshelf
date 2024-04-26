import { ActiveParamsSearchType, SearchInterface } from '../../modals/user';
import { createAction, props } from '@ngrx/store';

export const loadSearchBooks = createAction(
  '[Search] Load Search Books',
  props<{ params: ActiveParamsSearchType }>()
);
export const loadSearchBooksSuccess = createAction(
  '[Search] Load Search Books Success',
  props<{ data: SearchInterface }>()
);
export const loadSearchBooksFailure = createAction(
  '[Search] Load Search Books Failure',
  props<{ error: null }>()
);
