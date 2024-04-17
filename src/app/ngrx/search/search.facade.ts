import { Store } from '@ngrx/store';
import { SearchInterface } from '../../types/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { loadSearchBooks } from './search.actions';
import { selectSearchBooks } from './search.selector';

@Injectable({
  providedIn: 'root',
})
export class SearchFacade {
  constructor(private store: Store) {}

  loadSearchBooks(): void {
    console.log('Load search books method called');
    this.store.dispatch(loadSearchBooks());
  }
  getSearchBooks(): Observable<SearchInterface | null> {
    console.log('Get search books method called');
    return this.store.select(selectSearchBooks);
  }
}
