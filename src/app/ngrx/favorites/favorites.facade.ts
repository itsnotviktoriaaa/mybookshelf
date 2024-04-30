import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../modals/user';
import { loadFavoritesBooks, removeFromFavoritesBooks } from './favorites.actions';
import { selectFavoritesBooks } from './favorites.selector';
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

  loadRemoveFavoritesBooks(bookId: string): void {
    this.store.dispatch(removeFromFavoritesBooks({ bookId }));
  }
}
