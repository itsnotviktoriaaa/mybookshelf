import { setUserAction } from './auth-firebase.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { UserState } from './auth-firebase.state';

const initialState: UserState = {
  user: null,
};

const _userReducer = createReducer(
  initialState,
  on(setUserAction, (state, { user }) => ({
    ...state,
    user: user,
  }))
);

export function userReducer(state: UserState | undefined, action: Action) {
  return _userReducer(state, action);
}
