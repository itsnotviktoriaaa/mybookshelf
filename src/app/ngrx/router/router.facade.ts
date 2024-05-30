import { selectParams, selectPreviousUrl, selectQueryParams, selectUrl } from './router.selectors';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterFacadeService {
  constructor(private readonly store: Store) {}

  readonly getParams$: Observable<Params> = this.store.select(selectParams);

  readonly getQueryParams$: Observable<Params> = this.store.select(selectQueryParams);

  readonly getUrl$: Observable<string> = this.store.select(selectUrl);

  readonly getPreviousUrl$: Observable<string | null> = this.store.select(selectPreviousUrl);
}
