import { ActivatedRouteSnapshot, Data, Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterState {
  url: string;
  previousUrl: string | null;
  queryParams: Params;
  params: Params;
  data: Data;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterState> {
  private previousUrl: string | null = null;

  serialize = (state: RouterStateSnapshot): RouterState => {
    const currentState = {
      url: state.url,
      previousUrl: this.previousUrl,
      params: mergeRouteParams(state.root, ({ params }) => params),
      queryParams: mergeRouteParams(state.root, ({ queryParams }) => queryParams),
      data: mergeRouteData(state.root),
    };

    this.previousUrl = state.url;
    return currentState;
  };
}

const mergeRouteParams = (
  route: ActivatedRouteSnapshot,
  getter: (activatedRoute: ActivatedRouteSnapshot) => Params
): Params =>
  !route
    ? {}
    : {
        ...getter(route),
        ...mergeRouteParams(
          (route.children.find(({ outlet }) => outlet === 'primary') ||
            route.firstChild) as ActivatedRouteSnapshot,
          getter
        ),
      };

const mergeRouteData = (route: ActivatedRouteSnapshot): Data =>
  !route
    ? {}
    : {
        ...route.data,
        ...mergeRouteData(
          (route.children.find(({ outlet }) => outlet === 'primary') ||
            route.firstChild) as ActivatedRouteSnapshot
        ),
      };
