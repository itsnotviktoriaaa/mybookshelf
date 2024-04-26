import { SearchSmallInterface } from '../../modals/user';
import { loadAuthor } from './author.actions';
import { selectAuthor } from './author.selector';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
