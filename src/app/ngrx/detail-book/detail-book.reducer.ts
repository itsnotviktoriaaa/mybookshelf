import { DetailBookState } from './';
import { Action, createReducer, on } from '@ngrx/store';
import { loadDetailBookFailure, loadDetailBookSuccess } from './';

export const initialStateDetailBook: DetailBookState = {
  detailBook: null,
};

const _detailBookState = createReducer(
  initialStateDetailBook,
  on(loadDetailBookSuccess, (state, { data }) => ({
    ...state,
    detailBook: data,
  })),
  on(loadDetailBookFailure, state => ({
    ...state,
    detailBook: null,
  }))
);

export function detailReducer(state: DetailBookState | undefined, action: Action) {
  return _detailBookState(state, action);
}
