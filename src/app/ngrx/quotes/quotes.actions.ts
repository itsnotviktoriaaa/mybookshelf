import { createAction, props } from '@ngrx/store';
import { IQuotesSmall } from 'app/models';

export const loadQuotes = createAction('[Home] Load Quotes');
export const loadQuotesSuccess = createAction(
  '[Home] Load Quotes Success',
  props<{ data: IQuotesSmall[] }>()
);
export const loadQuotesFailure = createAction(
  '[Home] Load Quotes Failure',
  props<{ error: null }>()
);
