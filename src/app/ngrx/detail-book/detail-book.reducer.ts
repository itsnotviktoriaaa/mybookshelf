import { loadDetailBookFailure, loadDetailBookSuccess } from './detail-book.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { DetailBookState } from './detail-book.state';

export const initialState: DetailBookState = {
  detailBook: null,
};

const _detailBookState = createReducer(
  initialState,
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
