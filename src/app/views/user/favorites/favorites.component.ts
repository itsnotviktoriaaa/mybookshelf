import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActiveParamUtil, SearchStateService } from 'core/';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs';
import { IActiveParamsSearch } from 'modals/';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from 'components/';
import { RouterFacadeService } from 'ngr/';
import { MiniLoaderComponent } from 'ui/';
import { Params } from '@angular/router';
import { DestroyDirective } from 'core/';
import { FavoritesFacade } from 'ngr/';
import { FavouriteStore } from 'ngr/';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BookComponent, AsyncPipe, MiniLoaderComponent, TranslateModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit, OnDestroy {
  // isLoading$: Observable<boolean>;
  // favoritesBooks$: Observable<IBookItemTransformedWithTotal | null> = of(null);
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  store = inject(FavouriteStore);

  constructor(
    private favoriteFacade: FavoritesFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService
  ) {
    // this.isLoading$ = this.favoriteFacade.getLoadingOfFavoritesBooks();
  }

  ngOnInit(): void {
    this.searchStateService.setFavoritePage(true);

    this.routerFacadeService.getQueryParams$
      .pipe(debounceTime(1), takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        console.log(params);

        const newParamsForFavorite: IActiveParamsSearch =
          ActiveParamUtil.processParamsForFavoritePage(params);

        this.loadFavorites(newParamsForFavorite);

        // this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
        // this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks();
      });
  }

  loadFavorites(newParamsForFavorite: IActiveParamsSearch): void {
    this.store.loadAll(newParamsForFavorite);
  }

  ngOnDestroy(): void {
    this.searchStateService.setFavoritePage(false);
  }
}
