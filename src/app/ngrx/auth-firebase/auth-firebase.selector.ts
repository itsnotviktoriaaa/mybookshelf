import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './auth-firebase.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(selectUserState, (state: UserState) => state.user);
