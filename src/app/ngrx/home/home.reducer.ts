import { createReducer, on, Action } from '@ngrx/store';
import { loadRecommendedBooksSuccess, loadRecommendedBooksFailure, loadReadingNowBooksSuccess, loadReadingNowBooksFailure } from './home.actions';
import { HomeNowState, HomeState } from './home.state';

export const initialState: HomeState = {
  recommendedBooks: null,
};

const _homeReducer = createReducer(
  initialState,
  on(loadRecommendedBooksSuccess, (state, { data }) => ({
    ...state,
    recommendedBooks: data,
  })),
  on(loadRecommendedBooksFailure, state => ({
    ...state,
    recommendedBooks: null,
  }))
);

export function homeReducer(state: HomeState | undefined, action: Action) {
  return _homeReducer(state, action);
}

export const initialState1: HomeNowState = {
  readingNowBooks: null,
};

const _homeNowReducer = createReducer(
  initialState1,
  on(loadReadingNowBooksSuccess, (state, { data }) => ({
    ...state,
    readingNowBooks: data,
  })),
  on(loadReadingNowBooksFailure, state => ({
    ...state,
    readingNowBooks: null,
  }))
);

export function homeNowReducer(state: HomeNowState | undefined, action: Action) {
  return _homeNowReducer(state, action);
}
