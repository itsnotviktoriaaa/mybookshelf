import { IActiveParamsSearch, ISearch } from '../../modals/user';
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

  loadSearchBooks(params: IActiveParamsSearch): void {
    this.store.dispatch(loadSearchBooks({ params }));
  }
  getSearchBooks(): Observable<ISearch | null> {
    return this.store.select(selectSearchBooks);
  }
}
