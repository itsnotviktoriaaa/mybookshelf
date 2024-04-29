import { createAction, props } from '@ngrx/store';

export const setUserAction = createAction('[User] Set User', props<{ user: string | null }>());
