import { loadDetailBook, loadDetailBookFailure, loadDetailBookSuccess } from './';
import { Action, createReducer, on } from '@ngrx/store';
import { DetailBookState } from './';

export const initialStateDetailBook: DetailBookState = {
  detailBook: null,
  isLoading: false,
};

const _detailBookState = createReducer(
  initialStateDetailBook,
  on(loadDetailBook, state => ({
    ...state,
    isLoading: true,
  })),
  on(loadDetailBookSuccess, (state, { data }) => ({
    ...state,
    detailBook: data,
    isLoading: false,
  })),
  on(loadDetailBookFailure, state => ({
    ...state,
    detailBook: null,
    isLoading: false,
  }))
);

export function detailReducer(state: DetailBookState | undefined, action: Action) {
  return _detailBookState(state, action);
}
