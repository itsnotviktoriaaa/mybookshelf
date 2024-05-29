import { selectDetailBook, selectLoadingOfDetailBook } from './detail-book.selector';
import { IDetailBookSmallInfo } from '../../models/personal-library';
import { loadDetailBook } from './detail-book.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailBookFacade {
  constructor(private store: Store) {}

  loadDetailBook(idOfBook: string): void {
    this.store.dispatch(loadDetailBook({ idOfBook }));
  }

  getDetailBook(): Observable<IDetailBookSmallInfo | null> {
    return this.store.select(selectDetailBook);
  }

  getLoadingOfDetailBook(): Observable<boolean> {
    return this.store.select(selectLoadingOfDetailBook);
  }
}
