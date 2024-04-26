import { ActiveParamsSearchType, SearchInterface } from '../../modals/user';
import { selectSearchBooks } from './search.selector';
import { loadSearchBooks } from './search.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
