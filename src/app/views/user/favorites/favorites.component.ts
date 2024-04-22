import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared/components';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../types/user';
import { AsyncPipe } from '@angular/common';
import { MiniModalComponent } from '../../../shared/components';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { SearchStateService } from '../../../shared/services/search-state.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BookComponent, AsyncPipe, MiniModalComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoritesBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);

  miniLoader$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });

  constructor(
    private favoriteFacade: FavoritesFacade,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.searchStateService.setFavoritePage(true);

    this.miniLoader$.next({ miniLoader: true });
    this.favoriteFacade.loadFavoritesBooks();
    this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks().pipe(
      tap((books: arrayFromBookItemTransformedInterface | null): void => {
        console.log(books);
        this.miniLoader$.next({ miniLoader: false });
      })
    );
  }

  ngOnDestroy(): void {
    this.searchStateService.setFavoritePage(false);
  }
}
