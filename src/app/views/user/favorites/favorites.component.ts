import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { Store } from '@ngrx/store';
import { loadFavoritesBooks } from '../../../ngrx/favorites/favorites.actions';
import { Observable, of } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { selectFavoritesBooks } from '../../../ngrx/favorites/favorites.selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BookComponent, AsyncPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit {
  favoritesBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadFavoritesBooks());
    this.favoritesBooks$ = this.store.select(selectFavoritesBooks);
  }
}
