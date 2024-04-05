import { createAction, props } from '@ngrx/store';
import { AuthorSmallInterface } from '../../../types/user/book.interface';

export const loadAuthor = createAction('[Author] Load Detail Author', props<{ author: string }>());
export const loadAuthorSuccess = createAction('[Author] Load Detail Author Success', props<{ data: AuthorSmallInterface }>());
export const loadAuthorFailure = createAction('[Author] Load Detail Author Failure', props<{ error: null }>());
