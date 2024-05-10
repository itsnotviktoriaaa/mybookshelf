import { IBookItemTransformed } from '../../modals/user';
import { createAction, props } from '@ngrx/store';

export const loadMyBooks = createAction('[MyBooks] Load My Books');
export const loadMyBooksSuccess = createAction(
  '[MyBooks] Load My Books Success',
  props<{ data: IBookItemTransformed[] }>()
);
export const loadMyBooksFailure = createAction(
  '[MyBooks] Load My Books Failure',
  props<{ error: null }>()
);

export const removeFromMyBooks = createAction(
  '[MyBooks] Remove My Book',
  props<{ id: string; webReaderLink: string; thumbnail: string }>()
);
export const removeFromMyBooksSuccess = createAction(
  '[MyBooks] Remove My Book Success',
  props<{ bookId: string }>()
);
export const removeFromMyBooksFailure = createAction(
  '[MyBooks] Remove My Book Failure',
  props<{ error: null }>()
);
