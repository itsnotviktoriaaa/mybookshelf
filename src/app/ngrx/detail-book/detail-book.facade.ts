import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { loadDetailBook } from './detail-book.actions';
import { selectDetailBook } from './detail-book.selector';
import { DetailBookSmallInfo } from '../../types/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailBookFacade {
  constructor(private store: Store) {}

  loadDetailBook(idOfBook: string): void {
    this.store.dispatch(loadDetailBook({ idOfBook }));
  }

  getDetailBook(): Observable<DetailBookSmallInfo | null> {
    return this.store.select(selectDetailBook);
  }
}