import { Action, createReducer, on } from '@ngrx/store';
import { setUserAction } from './';
import { UserState } from './';

export const initialStateUser: UserState = {
  user: null,
};

const _userReducer = createReducer(
  initialStateUser,
  on(setUserAction, (state, { user }) => ({
    ...state,
    user: user,
  }))
);

export function userReducer(state: UserState | undefined, action: Action) {
  return _userReducer(state, action);
}
