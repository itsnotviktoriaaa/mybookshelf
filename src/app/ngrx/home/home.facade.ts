import { selectReadingNowBooks, selectRecommendedBooks } from './home.selectors';
import { loadReadingNowBooks, loadRecommendedBooks } from './home.actions';
import { IBookItemTransformedWithTotal } from '../../modals/user';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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

  getRecommendedBooks(): Observable<IBookItemTransformedWithTotal | null> {
    return this.store.select(selectRecommendedBooks);
  }

  getReadingNowBooks(): Observable<IBookItemTransformedWithTotal | null> {
    return this.store.select(selectReadingNowBooks);
  }
}
