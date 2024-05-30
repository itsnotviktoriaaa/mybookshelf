import { selectAuthor } from './author.selector';
import { loadAuthor } from './author.actions';
import { Injectable } from '@angular/core';
import { ISearchSmall } from 'app/models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorFacade {
  constructor(private store: Store) {}

  loadAuthor(author: string, idOfBook: string): void {
    this.store.dispatch(loadAuthor({ author, idOfBook }));
  }

  getDetailBook(): Observable<ISearchSmall | null> {
    return this.store.select(selectAuthor);
  }
}
