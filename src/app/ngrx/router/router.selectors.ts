import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterState } from './';

export const selectRouterState = createFeatureSelector<RouterReducerState<RouterState>>('router');

export const selectParams = createSelector(selectRouterState, router => router?.state?.params);

export const selectQueryParams = createSelector(
  selectRouterState,
  router => router?.state?.queryParams
);

export const selectUrl = createSelector(selectRouterState, router => router?.state?.url);

export const selectPreviousUrl = createSelector(
  selectRouterState,
  router => router?.state?.previousUrl
);
