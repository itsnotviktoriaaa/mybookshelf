import { IActiveParamsSearch, IBookItemTransformedWithTotal } from 'app/models';
import { selectFavoritesBooks, selectLoadingOfFavoritesBooks } from './';
import { loadFavoritesBooks, removeFromFavoritesBooks } from './';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesFacade {
  constructor(private store: Store) {}

  loadFavoritesBooks(params: IActiveParamsSearch): void {
    this.store.dispatch(loadFavoritesBooks({ params }));
  }
  getFavoritesBooks(): Observable<IBookItemTransformedWithTotal | null> {
    return this.store.select(selectFavoritesBooks);
  }

  getLoadingOfFavoritesBooks(): Observable<boolean> {
    return this.store.select(selectLoadingOfFavoritesBooks);
  }

  loadRemoveFavoritesBooks(bookId: string): void {
    this.store.dispatch(removeFromFavoritesBooks({ bookId }));
  }
}
