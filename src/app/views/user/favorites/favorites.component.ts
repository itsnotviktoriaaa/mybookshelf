import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { Store } from '@ngrx/store';
import { loadFavoritesBooks } from '../../../ngrx/favorites/favorites.actions';
import { Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { selectFavoritesBooks } from '../../../ngrx/favorites/favorites.selector';
import { AsyncPipe } from '@angular/common';
import { MiniModalComponent } from '../../../shared/components/minimodal/minimodal.component';

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
  miniLoader: boolean = true;
  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.miniLoader = true;
    this.store.dispatch(loadFavoritesBooks());
    this.favoritesBooks$ = this.store.select(selectFavoritesBooks).pipe(
      tap(() => {
        setTimeout(() => {
          this.miniLoader = false;
          this.cdr.detectChanges();
        }, 1000);
      })
    );
  }
}
