import { createReducer, on, Action } from '@ngrx/store';
import { loadRecommendedBooksSuccess, loadRecommendedBooksFailure, loadReadingNowBooksSuccess, loadReadingNowBooksFailure, loadRecommendedBooks } from './';
import { HomeNowState, HomeState } from './';

export const initialStateHome: HomeState = {
  recommendedBooks: null,
  loading: false,
};

const _homeReducer = createReducer(
  initialStateHome,
  on(loadRecommendedBooks, state => ({
    ...state,
    loading: true,
  })),
  on(loadRecommendedBooksSuccess, (state, { data }) => ({
    ...state,
    recommendedBooks: data,
    loading: false,
  })),
  on(loadRecommendedBooksFailure, state => ({
    ...state,
    recommendedBooks: null,
    loading: false,
  }))
);

export function homeReducer(state: HomeState | undefined, action: Action) {
  return _homeReducer(state, action);
}

export const initialStateReading: HomeNowState = {
  readingNowBooks: null,
};

const _homeNowReducer = createReducer(
  initialStateReading,
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
