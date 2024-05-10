import {
  loadRecommendedBooksSuccess,
  loadRecommendedBooksFailure,
  loadReadingNowBooksSuccess,
  loadReadingNowBooksFailure,
  loadRecommendedBooks,
  loadReadingNowBooks,
} from './home.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { HomeNowState, HomeState } from './home.state';

export const initialState: HomeState = {
  recommendedBooks: null,
  loading: true,
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
  loading: false,
};

const _homeNowReducer = createReducer(
  initialState1,
  on(loadReadingNowBooks, state => ({
    ...state,
    loading: true,
  })),
  on(loadReadingNowBooksSuccess, (state, { data }) => ({
    ...state,
    readingNowBooks: data,
    loading: false,
  })),
  on(loadReadingNowBooksFailure, state => ({
    ...state,
    readingNowBooks: null,
    loading: false,
  }))
);

export function homeNowReducer(state: HomeNowState | undefined, action: Action) {
  return _homeNowReducer(state, action);
}
