import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActiveParamUtil, SearchStateService } from 'core/';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs';
import { IActiveParamsSearch } from 'models/';
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
  store = inject(FavouriteStore);
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private favoriteFacade: FavoritesFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService
  ) {}

  ngOnInit(): void {
    this.searchStateService.setFavoritePage(true);

    this.routerFacadeService.getQueryParams$
      .pipe(debounceTime(1), takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        console.log(params);

        const newParamsForFavorite: IActiveParamsSearch =
          ActiveParamUtil.processParamsForFavoritePage(params);

        this.loadFavorites(newParamsForFavorite);
      });
  }

  loadFavorites(newParamsForFavorite: IActiveParamsSearch): void {
    this.store.loadAll(newParamsForFavorite);
  }

  ngOnDestroy(): void {
    this.searchStateService.setFavoritePage(false);
  }
}
