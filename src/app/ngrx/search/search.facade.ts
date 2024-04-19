import { Store } from '@ngrx/store';
import { ActiveParamsSearchType, SearchInterface } from '../../types/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { loadSearchBooks } from './search.actions';
import { selectSearchBooks } from './search.selector';

@Injectable({
  providedIn: 'root',
})
export class SearchFacade {
  constructor(private store: Store) {}

  loadSearchBooks(params: ActiveParamsSearchType): void {
    this.store.dispatch(loadSearchBooks({ params }));
  }
  getSearchBooks(): Observable<SearchInterface | null> {
    return this.store.select(selectSearchBooks);
  }
}
