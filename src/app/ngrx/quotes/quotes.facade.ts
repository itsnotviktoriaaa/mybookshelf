import { selectQuotes } from 'ngr/quotes/quotes.selector';
import { loadQuotes } from 'ngr/quotes/quotes.actions';
import { filter, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { IQuotesSmall } from 'app/models';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class QuotesFacade {
  constructor(private store: Store) {}

  loadQuotes(): void {
    this.getQuotes()
      .pipe(
        filter(quotes => !quotes),
        tap(() => {
          this.store.dispatch(loadQuotes());
        })
      )
      .subscribe();
  }

  getQuotes(): Observable<IQuotesSmall[] | null> {
    return this.store.select(selectQuotes);
  }
}
