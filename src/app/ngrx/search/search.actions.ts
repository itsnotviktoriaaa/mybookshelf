import { createAction, props } from '@ngrx/store';
import { SearchInterface } from '../../types/user';
import { ActiveParamsType } from '../../shared/utils/active-param.util';

export const loadSearchBooks = createAction(
  '[Search] Load Search Books',
  props<{ params: ActiveParamsType }>()
);
export const loadSearchBooksSuccess = createAction(
  '[Search] Load Search Books Success',
  props<{ data: SearchInterface }>()
);
export const loadSearchBooksFailure = createAction(
  '[Search] Load Search Books Failure',
  props<{ error: null }>()
);
