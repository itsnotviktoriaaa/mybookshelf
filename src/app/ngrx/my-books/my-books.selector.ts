import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MyBooksState } from './my-books.state';

export const selectMyBooksState = createFeatureSelector<MyBooksState>('myBooks');
export const selectMyBooks = createSelector(
  selectMyBooksState,
  (state: MyBooksState) => state.myBooks
);

export const selectLoadingOfMyBooks = createSelector(
  selectMyBooksState,
  (state: MyBooksState) => state.isLoading
);
