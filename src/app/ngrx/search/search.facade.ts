import { Store } from '@ngrx/store';
import { SearchInterface } from '../../types/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { loadSearchBooks } from './search.actions';
import { selectSearchBooks } from './search.selector';
import { ActiveParamsType } from '../../shared/utils/active-param.util';

@Injectable({
  providedIn: 'root',
})
export class SearchFacade {
  constructor(private store: Store) {}

  loadSearchBooks(params: ActiveParamsType): void {
    console.log('Load search books method called');
    this.store.dispatch(loadSearchBooks({ params }));
  }
  getSearchBooks(): Observable<SearchInterface | null> {
    console.log('Get search books method called');
    return this.store.select(selectSearchBooks);
  }
}
