import {
  ActiveParamsSearchType,
  arrayFromBookItemTransformedInterface,
  BookItemTransformedInterface,
  SearchInterface,
  SelectedHeaderModalItemEnum,
} from '../../../modals/user';
import { FavoritesFacade } from '../../../ngrx/favorites/favorites.facade';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActiveParamUtil, SearchStateService } from '../../../core';
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
  headerModalSearchItems: string[] = [
    'Browse',
    'Computers',
    'Study Aids',
    'Religion',
    'Social Science',
    'Government attorneys',
    'Juvenile Nonfiction',
    'Business & Economics',
    'Language Arts & Disciplines',
    'Database management',
    'Reference',
    'Automatic indexing',
    'Computer industry',
    'Memory',
    'Public health',
    'CGI (Computer network protocol)',
    'Computer-assisted instruction',
    'Documentation',
    'Games & Activities',
    'Bioengineering',
    'Aeronautics',
    'Law reviews',
    'Books and reading',
    'Psychology',
    'Games',
    'Authorship',
    'Crafts & Hobbies',
    'Chemical engineering',
    'Philosophy',
    'Medicine',
    'Career change',
    'Minnesota',
    'Architecture',
    'English language',
    'History',
    'Literary Collections',
    'Law',
    'Information services',
    'Law reports, digests, etc',
    'Computer service industry',
    'Computer simulation',
    'Machine learning',
    'Electronic journals',
    'Piano',
    'Science',
    'Data mining',
    'Expert systems (Computer science)',
    'Macintosh (Computer)',
    'Government publications',
    'Cross-cultural studies',
    'Applied linguistics',
    'Context (Linguistics)',
    'Medical',
    'Terms and phrases',
    'Humanities',
    'Juvenile Fiction',
    'Education',
    'Southern States',
    'Engineering',
    'Information storage and retrieval systems',
    'Dental care',
    'Pets',
    'Nigeria',
    'Technology & Engineering',
    'Periodicals',
    'Foreign Language Study',
    'Action theory',
    'Encyclopedias and dictionaries',
    'Vocational education',
    'Library science',
    'Nuclear energy',
    'Industrial management',
    'Soil conservation',
    'Young Adult Fiction',
    'Linguistics',
    'Computer programs',
    'Communications, Military',
    'Political Science',
    'Humor',
    'Geology',
    'Art',
    'Iowa',
    'Computer security',
    'International cooperation',
    'Ireland',
    'India',
    'Logic programming',
    'Police',
    'Case-based reasoning',
    'Computer engineering',
    'Artificial intelligence',
    'Business',
    'Computer software',
    'Computational linguistics',
    'Microcomputers',
    'Interventional magnetic resonance imaging',
    'Almanacs',
    'Nutrition',
    'Computer algorithms',
    'California',
    'Electronic books',
    'Mathematics',
    'Latin America',
    'Computerized self-help devices for people with disabilities',
    'Hypercube networks (Computer networks)',
    'Pharmacology',
    'Ethnomusicology',
    'Electronic data processing',
    'Bills, Legislative',
    'Bibles',
    'Delegated legislation',
    'Sports & Recreation',
    'London (England)',
    'Economics',
    'New Zealand',
    'Commerce',
    'Pleading',
    'Operating systems (Computers)',
    'Gazettes',
    'Power resources',
    'Fiction',
    'Rogues and vagabonds',
    'Internet marketing',
    'Astrionics',
    'Combinatorial analysis',
    'Copyright',
    'Music',
    'Electronics',
    'Curriculum planning',
    'Mermaids',
    'Medical care',
    'Australia',
    'Folklore',
    'Earth sciences',
    'Programming languages (Electronic computers)',
    'Big data',
    'New Jersey',
    'Fisheries',
    'Computer interfaces',
    'Library resources',
    'Scrabble (Game)',
    'Indians of North America',
    'Nature',
    'Construction industry',
    'Authors, English',
    'Evidence-based medicine',
    'Children with social disabilities',
    'Sri Lanka',
    'Adventure stories',
  ];

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
    this.headerModalSearchText.next('Browse');
    this.searchStateService
      .getHeaderModalItem()
      .pipe(
        tap((type: string): void => {
          if (type.toLowerCase() === SelectedHeaderModalItemEnum.Subject.toLowerCase()) {
            this.headerModalSearchText.next(this.headerModalSearchItems[1]);
            this.searchStateService.setSearchCategory(this.headerModalSearchItems[1]);
          } else {
            this.headerModalSearchText.next('Browse');
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
    console.log(params);
    if (params.hasOwnProperty('category')) {
      this.headerModalSearchText.next(
        params['category'].slice(0, 1).toUpperCase() + params['category'].slice(1)
      );
      this.searchStateService.setSearchCategory(
        params['category'].slice(0, 1).toUpperCase() + params['category'].slice(1)
      );
    }
  }

  // @HostListener('document:click', ['$event'])
  // click(event: Event) {
  //   if (this.browseMiniModal && !(event.target as Element).closest('.header-search-info')) {
  //     this.browseMiniModal = false;
  //   }
  // }
}
