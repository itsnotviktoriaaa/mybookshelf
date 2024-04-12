import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared/components';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../types/user';
import { AsyncPipe } from '@angular/common';
import { MiniModalComponent } from '../../../shared/components';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BookComponent, AsyncPipe, MiniModalComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit {
  favoritesBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);

  miniLoader$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });

  constructor(private favoriteFacade: FavoritesFacade) {}

  ngOnInit(): void {
    this.miniLoader$.next({ miniLoader: true });
    this.favoriteFacade.loadFavoritesBooks();
    this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks().pipe(
      tap((books: arrayFromBookItemTransformedInterface | null): void => {
        console.log(books);
        this.miniLoader$.next({ miniLoader: false });
      })
    );
  }
}
