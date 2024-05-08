import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../../modals/user';
import { BehaviorSubject, debounceTime, Observable, of, takeUntil, tap } from 'rxjs';
import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { ActiveParamUtil, SearchStateService } from '../../../core';
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
  favoritesBooks$: Observable<IBookItemTransformedWithTotal | null> = of(null);

  miniLoader$ = new BehaviorSubject<{ miniLoader: boolean }>({ miniLoader: true });

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
        this.miniLoader$.next({ miniLoader: true });

        const newParamsForFavorite: IActiveParamsSearch =
          ActiveParamUtil.processParamsForFavoritePage(params);

        this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
        this.favoritesBooks$ = this.favoriteFacade.getFavoritesBooks().pipe(
          tap((books: IBookItemTransformedWithTotal | null): void => {
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
