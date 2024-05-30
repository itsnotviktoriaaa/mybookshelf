import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthorState } from './';

export const selectAuthorState = createFeatureSelector<AuthorState>('author');
export const selectAuthor = createSelector(selectAuthorState, (state: AuthorState) => state.author);
