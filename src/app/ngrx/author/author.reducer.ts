import { loadAuthorFailure, loadAuthorSuccess } from './author.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { AuthorState } from './author.state';

export const initialStateAuthor: AuthorState = {
  author: null,
};

const _authorState = createReducer(
  initialStateAuthor,
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
