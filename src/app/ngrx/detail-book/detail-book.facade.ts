import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { loadDetailBook } from './';
import { selectDetailBook } from './';
import { DetailBookSmallInfo } from 'types/';
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
