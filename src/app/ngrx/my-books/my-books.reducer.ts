import { loadMyBooks, loadMyBooksFailure, loadMyBooksSuccess } from './my-books.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { MyBooksState } from './my-books.state';

export const initialStateMyBooks: MyBooksState = {
  myBooks: null,
  isLoading: false,
};

const _myBooksState = createReducer(
  initialStateMyBooks,
  on(loadMyBooks, state => ({
    ...state,
    isLoading: true,
  })),
  on(loadMyBooksSuccess, (state, { data }) => {
    if (data && data.length === 0) {
      return {
        ...state,
        myBooks: null,
        isLoading: false,
      };
    }

    return {
      ...state,
      myBooks: data,
      isLoading: false,
    };
  }),
  on(loadMyBooksFailure, state => ({
    ...state,
    myBooks: null,
    isLoading: false,
  }))
);

export function myBooksReducer(state: MyBooksState | undefined, action: Action) {
  return _myBooksState(state, action);
}
