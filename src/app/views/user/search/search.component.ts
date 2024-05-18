import {
  IActiveParamsSearch,
  IBookItemTransformedWithTotal,
  IBookItemTransformed,
  SearchEnum,
  ISearch,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from '../../../modals/user';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { ActiveParamUtil, CategoryModalSearchItems, SearchStateService } from '../../../core';
import { BehaviorSubject, debounceTime, filter, Observable, takeUntil, tap } from 'rxjs';
import { MiniLoaderComponent, PaginationInputComponent } from '../../../UI-сomponents';
import { environment } from '../../../../environments/environment.development';
import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { SearchFacade } from '../../../ngrx/search/search.facade';
import { SearchBookComponent } from '../../../components';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { AsyncPipe } from '@angular/common';
import { Params } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    SvgIconComponent,
    SearchBookComponent,
    AsyncPipe,
    PaginationInputComponent,
    TranslateModule,
    MiniLoaderComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  browseMiniModal: boolean = false;
  headerModalSearchText = new BehaviorSubject<string | null>(null);
  headerModalSearchItems = CategoryModalSearchItems;
  pathToIcons = environment.pathToIcons;
  searchBooks$ = new BehaviorSubject<ISearch | null>(null);
  idOfFavorites: string[] = [];
  private readonly destroy$ = inject(DestroyDirective).destroy$;
  isLoading$: Observable<boolean>;

  constructor(
    private searchFacade: SearchFacade,
    private favoriteFacade: FavoritesFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService
  ) {
    this.isLoading$ = this.searchFacade.getLoadingOfSearchBooks();
  }

  ngOnInit(): void {
    this.headerModalSearchText.next(SearchEnum.Browse);
    this.searchStateService
      .getHeaderModalItem()
      .pipe(
        takeUntil(this.destroy$),
        tap((type: string): void => {
          if (
            type.toLowerCase() === SelectedHeaderModalItemEngEnum.Subject.toLowerCase() ||
            type.toLowerCase() === SelectedHeaderModalItemRusEnum.Subject.toLowerCase()
          ) {
            this.headerModalSearchText.next(this.headerModalSearchItems[1]);
            this.searchStateService.setSearchCategory(this.headerModalSearchItems[1]);
          } else {
            this.headerModalSearchText.next(SearchEnum.Browse);
          }
        })
      )
      .subscribe();

    this.routerFacadeService.getQueryParams$
      .pipe(
        debounceTime(1),
        tap((params: Params): void => {
          this.setValuesFromParams(params);

          const newParams: IActiveParamsSearch = ActiveParamUtil.processParam(params);

          this.searchFacade.loadSearchBooks(newParams);
          this.searchFacade
            .getSearchBooks()
            .pipe(
              tap((data: ISearch | null): void => {
                this.searchBooks$.next(data);
              }),
              takeUntil(this.destroy$)
            )
            .subscribe();

          const newParamsForFavorite: IActiveParamsSearch =
            ActiveParamUtil.processParamsForFavoritePage(params);

          this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
          this.favoriteFacade
            .getFavoritesBooks()
            .pipe(
              takeUntil(this.destroy$),
              filter((data: IBookItemTransformedWithTotal | null) => !!data),
              tap((books: IBookItemTransformedWithTotal | null): void => {
                const newArrayWithIdOfFavorites: string[] = [];
                if (books && books.items && books.items.length > 0) {
                  books.items.forEach((item: IBookItemTransformed): void => {
                    newArrayWithIdOfFavorites.push(item.id);
                  });
                  this.idOfFavorites = newArrayWithIdOfFavorites;
                }
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  openOrCloseMiniModal(): void {
    this.browseMiniModal = !this.browseMiniModal;
  }

  chooseCategory(headerModalSearchText: string): void {
    this.headerModalSearchText.next(headerModalSearchText);
    this.browseMiniModal = false;
    this.searchStateService.setSearchCategory(headerModalSearchText);
  }

  setValuesFromParams(params: Params): void {
    if (params.hasOwnProperty('category')) {
      const transformValueToUpperCaseFromParams =
        params['category'].slice(0, 1).toUpperCase() + params['category'].slice(1);

      this.headerModalSearchText.next(transformValueToUpperCaseFromParams);
      this.searchStateService.setSearchCategory(transformValueToUpperCaseFromParams);
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.browseMiniModal && !(event.target as Element).closest('.header-search-info')) {
      this.browseMiniModal = false;
    }
  }
}
