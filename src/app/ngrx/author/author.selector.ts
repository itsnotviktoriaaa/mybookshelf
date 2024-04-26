import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthorState } from './author.state';

export const selectAuthorState = createFeatureSelector<AuthorState>('author');
export const selectAuthor = createSelector(selectAuthorState, (state: AuthorState) => state.author);
