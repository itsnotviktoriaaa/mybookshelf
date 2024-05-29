import {
  IActiveParamsSearch,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
  ISearch,
  SearchEnum,
  SelectedHeaderModalItemEnum,
} from 'app/models';
import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { ActiveParamUtil, CategoryModalSearchItems, SearchStateService } from 'app/core';
import { MiniLoaderComponent, PaginationInputComponent } from 'app/uicomponents';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, filter, Observable, takeUntil, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SearchBookComponent } from 'app/components';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterFacadeService } from 'app/ngrx';
import { AsyncPipe } from '@angular/common';
import { DestroyDirective } from 'app/core';
import { FavoritesFacade } from 'app/ngrx';
import { Params } from '@angular/router';
import { SearchFacade } from 'app/ngrx';

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
    this.headerModalSearchText.next(SearchEnum.BROWSE);
    this.searchStateService
      .getHeaderModalItem()
      .pipe(
        tap((type: string): void => {
          if (type.toLowerCase() === SelectedHeaderModalItemEnum.SUBJECT.toLowerCase()) {
            this.headerModalSearchText.next(this.headerModalSearchItems[1]);
            this.searchStateService.setSearchCategory(this.headerModalSearchItems[1]);
          } else {
            this.headerModalSearchText.next(SearchEnum.BROWSE);
          }
        })
      )
      .subscribe();

    this.routerFacadeService.getQueryParams$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        this.setValuesFromParams(params);

        const newParams: IActiveParamsSearch = ActiveParamUtil.processParam(params);

        this.searchFacade.loadSearchBooks(newParams);
        this.searchFacade.getSearchBooks().subscribe(data => {
          this.searchBooks$.next(data);
        });

        const newParamsForFavorite: IActiveParamsSearch =
          ActiveParamUtil.processParamsForFavoritePage(params);

        this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
        this.favoriteFacade
          .getFavoritesBooks()
          .pipe(
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
      });
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
