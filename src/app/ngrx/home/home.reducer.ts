import {
  loadRecommendedBooksSuccess,
  loadRecommendedBooksFailure,
  loadReadingNowBooksSuccess,
  loadReadingNowBooksFailure,
  loadRecommendedBooks,
} from './home.actions';
import { HomeNowState, HomeState } from './home.state';
import { createReducer, on, Action } from '@ngrx/store';

export const initialState: HomeState = {
  recommendedBooks: null,
  loading: false,
};

const _homeReducer = createReducer(
  initialState,
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
