import { createAction, props } from '@ngrx/store';
import { IDetailBookSmallInfo } from 'app/models';

export const loadDetailBook = createAction(
  '[Detail Book] Load Detail Book',
  props<{ idOfBook: string }>()
);
export const loadDetailBookSuccess = createAction(
  '[Detail Book] Load Detail Books Success',
  props<{ data: IDetailBookSmallInfo }>()
);
export const loadDetailBookFailure = createAction(
  '[Detail Book] Load Detail Books Failure',
  props<{ error: null }>()
);
