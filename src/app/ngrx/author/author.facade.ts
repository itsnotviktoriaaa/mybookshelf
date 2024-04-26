import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAuthor } from './author.actions';
import { Observable } from 'rxjs';
import { selectAuthor } from './author.selector';
import { SearchSmallInterface } from '../../modals/user';

@Injectable({
  providedIn: 'root',
})
export class AuthorFacade {
  constructor(private store: Store) {}

  loadAuthor(author: string): void {
    this.store.dispatch(loadAuthor({ author }));
  }

  getDetailBook(): Observable<SearchSmallInterface | null> {
    return this.store.select(selectAuthor);
  }
}
