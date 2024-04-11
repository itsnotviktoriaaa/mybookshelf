import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAuthor } from './';
import { Observable } from 'rxjs';
import { AuthorSmallInterface } from 'types/';
import { selectAuthor } from './';

@Injectable({
  providedIn: 'root',
})
export class AuthorFacade {
  constructor(private store: Store) {}

  loadAuthor(author: string): void {
    this.store.dispatch(loadAuthor({ author }));
  }

  getDetailBook(): Observable<AuthorSmallInterface | null> {
    return this.store.select(selectAuthor);
  }
}
