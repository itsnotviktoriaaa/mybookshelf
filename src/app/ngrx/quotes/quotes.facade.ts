import { selectQuotes } from 'ngr/quotes/quotes.selector';
import { loadQuotes } from 'ngr/quotes/quotes.actions';
import { Injectable } from '@angular/core';
import { IQuotesSmall } from 'app/modals';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class QuotesFacade {
  constructor(private store: Store) {}

  loadQuotes(): void {
    this.getQuotes()
      .pipe(
        tap((quotes: IQuotesSmall[] | null): void => {
          if (!quotes) {
            this.store.dispatch(loadQuotes());
          }
        })
      )
      .subscribe();
  }

  getQuotes(): Observable<IQuotesSmall[] | null> {
    return this.store.select(selectQuotes);
  }
}
