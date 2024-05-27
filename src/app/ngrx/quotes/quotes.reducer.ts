import { loadQuotesFailure, loadQuotesSuccess } from 'ngr/quotes/quotes.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { QuotesState } from 'ngr/quotes/quotes.state';

export const initialStateQuotes: QuotesState = {
  quotes: null,
};

const _quotesState = createReducer(
  initialStateQuotes,
  on(loadQuotesSuccess, (state, { data }) => ({
    ...state,
    quotes: data,
  })),
  on(loadQuotesFailure, state => ({
    ...state,
    quotes: null,
  }))
);

export function quotesReducer(state: QuotesState | undefined, action: Action) {
  return _quotesState(state, action);
}
