import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuotesState } from 'ngr/quotes/quotes.state';

export const selectQuotesState = createFeatureSelector<QuotesState>('quotes');
export const selectQuotes = createSelector(selectQuotesState, (state: QuotesState) => state.quotes);
