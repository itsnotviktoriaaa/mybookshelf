import { ActiveParamsSearchType, arrayFromBookItemTransformedInterface } from '../../modals/user';
import { loadFavoritesBooks } from './favorites.actions';
import { selectFavoritesBooks } from './favorites.selector';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
