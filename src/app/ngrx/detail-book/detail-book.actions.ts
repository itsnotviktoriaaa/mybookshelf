import { createAction, props } from '@ngrx/store';
import { DetailBookSmallInfo } from '../../types/user';

export const loadDetailBook = createAction('[Detail Book] Load Detail Book', props<{ idOfBook: string }>());
export const loadDetailBookSuccess = createAction('[Detail Book] Load Detail Books Success', props<{ data: DetailBookSmallInfo }>());
export const loadDetailBookFailure = createAction('[Detail Book] Load Detail Books Failure', props<{ error: null }>());
