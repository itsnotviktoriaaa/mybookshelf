import { MiniModalComponent } from '../../../UI-сomponents';
import { BookComponent } from '../../../components';
import { ActiveParamUtil, SearchStateService } from '../../../core';
import {
  ActiveParamsSearchType,
  arrayFromBookItemTransformedInterface,
} from '../../../modals/user';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

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
    private searchStateService: SearchStateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchStateService.setFavoritePage(true);

    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      this.miniLoader$.next({ miniLoader: true });

      const newParamsForFavorite: ActiveParamsSearchType =
        ActiveParamUtil.processParamsForFavoritePage(params);

      this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
      this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks().pipe(
        tap((books: arrayFromBookItemTransformedInterface | null): void => {
          console.log(books);
          this.miniLoader$.next({ miniLoader: false });
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.searchStateService.setFavoritePage(false);
  }
}
