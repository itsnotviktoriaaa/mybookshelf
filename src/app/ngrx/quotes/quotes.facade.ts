import { selectQuotes } from 'ngr/quotes/quotes.selector';
import { loadQuotes } from 'ngr/quotes/quotes.actions';
import { Injectable } from '@angular/core';
import { IQuotesSmall } from 'app/models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesFacade {
  constructor(private store: Store) {}

  loadQuotes(): void {
    this.store.dispatch(loadQuotes());
  }

  getQuotes(): Observable<IQuotesSmall[] | null> {
    return this.store.select(selectQuotes);
  }
}
