import { loadAuthorFailure, loadAuthorSuccess } from './author.actions';
import { AuthorState } from './author.state';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: AuthorState = {
  author: null,
};

const _authorState = createReducer(
  initialState,
  on(loadAuthorSuccess, (state, { data }) => ({
    ...state,
    author: data,
  })),
  on(loadAuthorFailure, state => ({
    ...state,
    author: null,
  }))
);

export function authorReducer(state: AuthorState | undefined, action: Action) {
  return _authorState(state, action);
}
