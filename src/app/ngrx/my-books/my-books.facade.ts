import { selectLoadingOfMyBooks, selectMyBooks } from './my-books.selector';
import { loadMyBooks, removeFromMyBooks } from './my-books.actions';
import { IBookItemTransformed } from 'app/models';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyBooksFacade {
  constructor(private store: Store) {}

  loadMyBooks(): void {
    this.store.dispatch(loadMyBooks());
  }

  getMyBooks(): Observable<IBookItemTransformed[] | null> {
    return this.store.select(selectMyBooks);
  }

  getLoadingOfMyBooks(): Observable<boolean> {
    return this.store.select(selectLoadingOfMyBooks);
  }

  loadRemoveMyBook(id: string, webReaderLink: string, thumbnail: string): void {
    this.store.dispatch(removeFromMyBooks({ id, webReaderLink, thumbnail }));
  }
}
