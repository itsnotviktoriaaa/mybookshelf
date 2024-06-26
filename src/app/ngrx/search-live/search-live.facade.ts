import { loadSearchLiveBooks, resetSearchLiveBooks } from './';
import { Injectable } from '@angular/core';
import { selectSearchLiveBooks } from './';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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

  resetSearchLiveBooks(): void {
    this.store.dispatch(resetSearchLiveBooks({ data: null }));
  }
}
