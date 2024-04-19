import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { loadSearchLiveBooks } from './search-live.actions';
import { selectSearchLiveBooks } from './search-live.selector';

@Injectable({
  providedIn: 'root',
})
export class SearchLiveFacade {
  constructor(private store: Store) {}

  loadSearchLiveBooks(textFromInput: string, typeFromInput: string): void {
    this.store.dispatch(loadSearchLiveBooks({ textFromInput, typeFromInput }));
  }
  getSearchLiveBooks(): Observable<string[] | null> {
    return this.store.select(selectSearchLiveBooks);
  }
}
