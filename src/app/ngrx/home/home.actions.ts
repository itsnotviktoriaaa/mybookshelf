import { arrayFromBookItemTransformedInterface } from '../../modals/user';
import { createAction, props } from '@ngrx/store';

//Actions for getting books recommended
export const loadRecommendedBooks = createAction(
  '[Book] Load Recommended Books',
  props<{ startIndex: number }>()
);
export const loadRecommendedBooksSuccess = createAction(
  '[Book] Load Recommended Books Success',
  props<{ data: arrayFromBookItemTransformedInterface }>()
);
export const loadRecommendedBooksFailure = createAction(
  '[Book] Load Recommended Books Failure',
  props<{ error: null }>()
);

//Actions for getting books reading now
export const loadReadingNowBooks = createAction(
  '[Book] Load Reading Now Books',
  props<{ startIndex: number }>()
);
export const loadReadingNowBooksSuccess = createAction(
  '[Book] Load Reading Now Books Success',
  props<{ data: arrayFromBookItemTransformedInterface }>()
);
export const loadReadingNowBooksFailure = createAction(
  '[Book] Load Reading Now Books Failure',
  props<{ error: null }>()
);
