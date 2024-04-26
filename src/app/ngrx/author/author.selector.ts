import { AuthorState } from './author.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthorState = createFeatureSelector<AuthorState>('author');
export const selectAuthor = createSelector(selectAuthorState, (state: AuthorState) => state.author);
