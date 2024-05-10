import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../../modals/user';
import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { ActiveParamUtil, SearchStateService } from '../../../core';
import { debounceTime, Observable, of, takeUntil } from 'rxjs';
import { MiniModalComponent } from '../../../UI-сomponents';
import { TranslateModule } from '@ngx-translate/core';
import { BookComponent } from '../../../components';
import { AsyncPipe } from '@angular/common';
import { Params } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BookComponent, AsyncPipe, MiniModalComponent, TranslateModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  favoritesBooks$: Observable<IBookItemTransformedWithTotal | null> = of(null);
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private favoriteFacade: FavoritesFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService
  ) {
    this.isLoading$ = this.favoriteFacade.getLoadingOfFavoritesBooks();
  }

  ngOnInit(): void {
    this.searchStateService.setFavoritePage(true);

    this.routerFacadeService.getQueryParams$
      .pipe(debounceTime(1), takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        console.log(params);

        const newParamsForFavorite: IActiveParamsSearch =
          ActiveParamUtil.processParamsForFavoritePage(params);

        this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
        this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks();
      });
  }

  ngOnDestroy(): void {
    this.searchStateService.setFavoritePage(false);
  }
}
