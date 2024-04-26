import { Store } from '@ngrx/store';
import { loadFavoritesBooks } from './favorites.actions';
import { selectFavoritesBooks } from './favorites.selector';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActiveParamsSearchType, arrayFromBookItemTransformedInterface } from '../../modals/user';

@Injectable({
  providedIn: 'root',
})
export class FavoritesFacade {
  constructor(private store: Store) {}

  loadFavoritesBooks(params: ActiveParamsSearchType): void {
    this.store.dispatch(loadFavoritesBooks({ params }));
  }
  getFavoritesBooks(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.store.select(selectFavoritesBooks);
  }
}
