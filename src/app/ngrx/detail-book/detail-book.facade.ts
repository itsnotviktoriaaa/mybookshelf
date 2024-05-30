import { selectDetailBook, selectLoadingOfDetailBook } from './';
import { IDetailBookSmallInfo } from 'app/models';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadDetailBook } from './';
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
