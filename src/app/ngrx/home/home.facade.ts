import { Store } from '@ngrx/store';
import { loadReadingNowBooks, loadRecommendedBooks } from './';
import { Observable } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from 'types/';
import { selectReadingNowBooks, selectRecommendedBooks } from './';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeFacade {
  constructor(private store: Store) {}

  loadRecommendedBooks(startIndex: number): void {
    this.store.dispatch(loadRecommendedBooks({ startIndex }));
  }

  loadReadingNowBooks(startIndex: number): void {
    this.store.dispatch(loadReadingNowBooks({ startIndex }));
  }

  getRecommendedBooks(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.store.select(selectRecommendedBooks);
  }

  getReadingNowBooks(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.store.select(selectReadingNowBooks);
  }
}
