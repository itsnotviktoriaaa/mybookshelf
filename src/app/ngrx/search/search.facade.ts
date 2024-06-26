import { selectLoadingOfSearchBooks, selectSearchBooks } from './';
import { IActiveParamsSearch, ISearch } from 'app/models';
import { Injectable } from '@angular/core';
import { loadSearchBooks } from './';
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

  getLoadingOfSearchBooks(): Observable<boolean> {
    return this.store.select(selectLoadingOfSearchBooks);
  }
}
