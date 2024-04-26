import { createAction, props } from '@ngrx/store';
import { SearchSmallInterface } from '../../modals/user';

export const loadAuthor = createAction('[Author] Load Detail Author', props<{ author: string }>());
export const loadAuthorSuccess = createAction(
  '[Author] Load Detail Author Success',
  props<{ data: SearchSmallInterface }>()
);
export const loadAuthorFailure = createAction(
  '[Author] Load Detail Author Failure',
  props<{ error: null }>()
);
