import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookComponent } from 'shared/';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from 'types/';
import { AsyncPipe } from '@angular/common';
import { MiniModalComponent } from 'shared/';
import { FavoritesFacade } from 'ngr/';

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
  miniLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(private favoriteFacade: FavoritesFacade) {}

  ngOnInit(): void {
    this.miniLoader$.next(true);
    this.favoriteFacade.loadFavoritesBooks();
    this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks().pipe(
      tap(books => {
        console.log(books);
        this.miniLoader$.next(false);
      })
    );
  }
}
