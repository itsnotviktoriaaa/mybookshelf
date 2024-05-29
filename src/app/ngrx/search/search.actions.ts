import { IActiveParamsSearch, ISearch } from '../../models/personal-library';
import { createAction, props } from '@ngrx/store';

export const loadSearchBooks = createAction(
  '[Search] Load Search Books',
  props<{ params: IActiveParamsSearch }>()
);
export const loadSearchBooksSuccess = createAction(
  '[Search] Load Search Books Success',
  props<{ data: ISearch }>()
);
export const loadSearchBooksFailure = createAction(
  '[Search] Load Search Books Failure',
  props<{ error: null }>()
);
