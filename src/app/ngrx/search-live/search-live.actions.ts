import { createAction, props } from '@ngrx/store';
import { SearchInterface } from '../../types/user';

export const loadSearchLiveBooks = createAction(
  '[Search Live] Load Search Live Books',
  props<{ textFromInput: string; typeFromInput: string }>()
);
export const loadSearchLiveBooksSuccess = createAction(
  '[Search Live] Load Search Live Books Success',
  props<{ data: SearchInterface }>()
);
export const loadSearchLiveBooksFailure = createAction(
  '[Search Live] Load Search Live Books Failure',
  props<{ error: null }>()
);
