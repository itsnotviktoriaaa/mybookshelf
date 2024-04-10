import { Store } from '@ngrx/store';
import { loadFavoritesBooks } from './favorites.actions';
import { selectFavoritesBooks } from './favorites.selector';
import { arrayFromBookItemTransformedInterface } from '../../types/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesFacade {
  constructor(private store: Store) {}

  loadFavoritesBooks(): void {
    this.store.dispatch(loadFavoritesBooks());
  }
  getFavoritesBooks(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.store.select(selectFavoritesBooks);
  }
}
