import {
  ActiveParamsSearchType,
  arrayFromBookItemTransformedInterface,
  BookItemTransformedInterface,
  SearchEnum,
  SearchInterface,
  SelectedHeaderModalItemEnum,
} from '../../../modals/user';
import { ActiveParamUtil, CategoryModalSearchItems, SearchStateService } from '../../../core';
import { environment } from '../../../../environments/environment.development';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SearchFacade } from '../../../ngrx/search/search.facade';
import { PaginationInputComponent } from '../../../UI-сomponents';
import { SearchBookComponent } from '../../../components';
import { ActivatedRoute, Params } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SvgIconComponent, SearchBookComponent, AsyncPipe, PaginationInputComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  browseMiniModal: boolean = false;
  headerModalSearchText = new BehaviorSubject<string | null>(null);
  headerModalSearchItems = CategoryModalSearchItems;
  pathToIcons = environment.pathToIcons;

  searchBooks$: BehaviorSubject<SearchInterface | null> =
    new BehaviorSubject<SearchInterface | null>(null);
  idOfFavorites: string[] = [];

  constructor(
    private searchFacade: SearchFacade,
    private favoriteFacade: FavoritesFacade,
    private activatedRoute: ActivatedRoute,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.headerModalSearchText.next(SearchEnum.Browse);
    this.searchStateService
      .getHeaderModalItem()
      .pipe(
        tap((type: string): void => {
          if (type.toLowerCase() === SelectedHeaderModalItemEnum.Subject.toLowerCase()) {
            this.headerModalSearchText.next(this.headerModalSearchItems[1]);
            this.searchStateService.setSearchCategory(this.headerModalSearchItems[1]);
          } else {
            this.headerModalSearchText.next(SearchEnum.Browse);
          }
        })
      )
      .subscribe();

    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      console.log(params);

      this.setValuesFromParams(params);

      const newParams: ActiveParamsSearchType = ActiveParamUtil.processParam(params);

      this.searchFacade.loadSearchBooks(newParams);
      this.searchFacade.getSearchBooks().subscribe(data => {
        this.searchBooks$.next(data);
      });

      const newParamsForFavorite: ActiveParamsSearchType =
        ActiveParamUtil.processParamsForFavoritePage(params);

      this.favoriteFacade.loadFavoritesBooks(newParamsForFavorite);
      this.favoriteFacade
        .getFavoritesBooks()
        .pipe(
          filter((data: arrayFromBookItemTransformedInterface | null) => !!data),
          tap((books: arrayFromBookItemTransformedInterface | null): void => {
            const newArrayWithIdOfFavorites: string[] = [];
            if (books && books.items && books.items.length > 0) {
              books.items.forEach((item: BookItemTransformedInterface): void => {
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

  // @HostListener('document:click', ['$event'])
  // click(event: Event) {
  //   if (this.browseMiniModal && !(event.target as Element).closest('.header-search-info')) {
  //     this.browseMiniModal = false;
  //   }
  // }
}
