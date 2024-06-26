import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  HeaderClickEnum,
  HeaderModalI,
  IMenuRouter,
  IUserInfoFromGoogle,
  NotificationStatusEnum,
  SelectedHeaderModalItemEnum,
} from 'app/models';
import {
  AuthService,
  CategoryModalSearchItems,
  GoogleApiService,
  NotificationService,
  SearchStateService,
} from 'app/core';
import { environment } from '../../../../environments/environment.development';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { RouterFacadeService } from 'app/ngrx';
import { SearchLiveFacade } from 'app/ngrx';
import { DestroyDirective } from 'app/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    NgStyle,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;

  paramsFromUrl: Params = {};
  existUrl: string | null = null;
  isFavoritePage$ = new BehaviorSubject<boolean>(false);
  selectedHeaderModalItem = new BehaviorSubject<string>(SelectedHeaderModalItemEnum.ALL);

  searchTextTransformed: string = '';
  searchField: FormControl = new FormControl();
  searchTexts$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);

  pathToIcons = environment.pathToIcons;
  authServiceDestroy$: Subject<void> = new Subject<void>();
  userInfo$ = new BehaviorSubject<IUserInfoFromGoogle | null>(null);

  protected readonly HeaderClickInterfaceEnum = HeaderClickEnum;
  private readonly destroy$ = inject(DestroyDirective).destroy$;
  @ViewChild('burger') burger: ElementRef | null = null;

  headerModalLangItems = ['language.en', 'language.ru'];
  headerModalItems: HeaderModalI[] = [
    {
      translate: 'selected-header-modal-item.All',
      id: 'All',
    },
    {
      translate: 'selected-header-modal-item.Title',
      id: 'Title',
    },
    {
      translate: 'selected-header-modal-item.Author',
      id: 'Author',
    },
    {
      translate: 'selected-header-modal-item.Text',
      id: 'Text',
    },
    {
      translate: 'selected-header-modal-item.Subject',
      id: 'Subject',
    },
  ];

  headerModalAccountItems: IMenuRouter[] = [
    { translate: 'header-modal-account-item.profile', routerLink: '/home' },
    { translate: 'header-modal-account-item.favourite', routerLink: '/home/favorites' },
    { translate: 'header-modal-account-item.myBooks', routerLink: '/home/books' },
    { translate: 'header-modal-account-item.logout', routerLink: '/logout' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private googleApi: GoogleApiService,
    private searchLiveFacade: SearchLiveFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((info: IUserInfoFromGoogle | null): void => {
      if (info) {
        this.userInfo$.next(info);
      }
    });

    this.selectedHeaderModalItem.next(SelectedHeaderModalItemEnum.ALL);

    this.getSearchCategory();

    this.subscribeOnQueryParams();

    this.subscribeOnGetUrl();

    this.isFavoritePage();

    this.valueChangesInSearchField();
  }

  ngAfterViewInit(): void {
    if (this.burger && this.burger.nativeElement) {
      this.burger.nativeElement.addEventListener('click', (): void => {
        const bar: HTMLElement | null = document.getElementById('bar');
        if (bar) {
          bar.classList.add('bar-adaptive');
        }
      });
    }
  }

  public selectLanguage(lang: string): void {
    if (lang === 'language.en') {
      this.translateService.use('en');
    }

    if (lang === 'language.ru') {
      this.translateService.use('ru');
    }
  }

  getSearchCategory(): void {
    this.searchStateService
      .getSearchCategory()
      .pipe(
        tap((category: string) => {
          if (category.toLowerCase() !== 'browse') {
            this.selectedHeaderModalItem.next(SelectedHeaderModalItemEnum.SUBJECT);
          }
        })
      )
      .subscribe();
  }

  subscribeOnQueryParams(): void {
    this.routerFacadeService.getQueryParams$
      .pipe(
        tap((params: Params) => {
          this.setValuesFromParams(params);
          this.paramsFromUrl = params;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  subscribeOnGetUrl(): void {
    this.routerFacadeService.getUrl$
      .pipe(
        tap((url: string) => {
          this.existUrl = url;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  isFavoritePage(): void {
    this.searchStateService
      .getFavoritePage()
      .pipe(
        tap((param: boolean) => {
          this.isFavoritePage$.next(param);
          if (!this.paramsFromUrl['type']) {
            this.selectedHeaderModalItem.next(SelectedHeaderModalItemEnum.ALL);
          }
        })
      )
      .subscribe();
  }

  valueChangesInSearchField(): void {
    this.searchField.valueChanges
      .pipe(
        filter(value => {
          value = value.trim();
          if (!value) {
            this.searchTexts$.next(null);
            this.resetSearchLiveBooks();
            this.searchTextTransformed = '';
            return false;
          }

          this.searchTextTransformed = this.transformSearchString(value);
          return true;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (
            value &&
            value.length > 4 &&
            !this.isFavoritePage$.getValue() &&
            this.selectedHeaderModalItem.getValue()!.toLowerCase() !==
              SelectedHeaderModalItemEnum.SUBJECT.toLowerCase()
          ) {
            this.searchLiveFacade.loadSearchLiveBooks(
              value,
              this.selectedHeaderModalItem.getValue()!.toLowerCase()
            );

            return this.searchLiveFacade.getSearchLiveBooks();
          } else {
            return of(null);
          }
        })
      )
      .subscribe((data: string[] | null): void => {
        this.searchTexts$.next(data);
      });
  }

  transformSearchString(value: string): string {
    const stringWithSingleSpaces = value.replace(/\s+/g, ' ');
    return stringWithSingleSpaces.split(' ').join('+');
  }

  transformTextFromParams(value: string): string {
    let result = value.split('+').join(' ');
    result = result.trim();
    result = result.replace(/\s+/g, ' ');
    return result;
  }

  openOrCloseMiniModal(
    nameOfMiniModal:
      | HeaderClickEnum.ALLMINIMODAL
      | HeaderClickEnum.LANGMINIMODAL
      | HeaderClickEnum.PROFILEMINIMODAL
  ): void {
    if (nameOfMiniModal === HeaderClickEnum.ALLMINIMODAL) {
      if (this.existUrl?.includes('favorites')) {
        return;
      }
      this.allMiniModal = !this.allMiniModal;
    }
    if (nameOfMiniModal === HeaderClickEnum.LANGMINIMODAL) {
      this.langMiniModal = !this.langMiniModal;
    }
    if (nameOfMiniModal === HeaderClickEnum.PROFILEMINIMODAL) {
      this.profileMiniModal = !this.profileMiniModal;
    }
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.notificationService.sendNotification({
            message: 'Success logout',
            status: NotificationStatusEnum.SUCCESS,
          });
          this.router.navigate(['/']).then(() => {});
        }),
        catchError(() => {
          this.notificationService.sendNotification({
            message: 'Success logout',
            status: NotificationStatusEnum.SUCCESS,
          });
          this.router.navigate(['/']).then(() => {});
          return EMPTY;
        }),
        takeUntil(this.authServiceDestroy$)
      )
      .subscribe();
  }

  logoutForGoogle(): void {
    this.googleApi.signOut();
    this.authService.logout();
  }

  changeSelectedHeaderModalItem(headerModalItem: string): void {
    this.selectedHeaderModalItem.next(headerModalItem);
    this.searchStateService.setHeaderModalItem(headerModalItem);

    this.allMiniModal = false;
  }

  searchBooks(): void {
    this.searchTexts$.next(null);
    this.resetSearchLiveBooks();

    if (this.isFavoritePage$.getValue()) {
      this.router
        .navigate(['/home/favorites'], {
          queryParams: {
            text: this.searchTextTransformed,
          },
        })
        .then((): void => {});
      return;
    }

    this.searchStateService
      .getSearchCategory()
      .pipe(
        take(1),
        tap((category: string) => {
          let categoryNew: string = category;
          if (!this.existUrl?.includes('search')) {
            categoryNew = CategoryModalSearchItems[1];
          }
          if (
            this.selectedHeaderModalItem.getValue()?.toLowerCase() !==
            SelectedHeaderModalItemEnum.SUBJECT.toLowerCase()
          ) {
            categoryNew = 'browse';
          }

          this.router
            .navigate(['/home/search'], {
              queryParams: {
                text: this.searchTextTransformed,
                type: this.selectedHeaderModalItem?.getValue()?.toLowerCase(),
                category: categoryNew.toLowerCase(),
              },
            })
            .then((): void => {});
        })
      )
      .subscribe();
  }

  chooseOfferFromLiveSearch(text: string): void {
    this.searchField.setValue(text, { emitEvent: false });
    this.searchTextTransformed = this.transformSearchString(text);
    this.searchTexts$.next(null);
    this.resetSearchLiveBooks();
  }

  setValuesFromParams(params: Params): void {
    if (params.hasOwnProperty('type')) {
      const transformValueToUpperCaseFromParams =
        params['type'].slice(0, 1).toUpperCase() + params['type'].slice(1);

      this.selectedHeaderModalItem.next(transformValueToUpperCaseFromParams);
      this.searchStateService.setHeaderModalItem(transformValueToUpperCaseFromParams);
    }

    if (params.hasOwnProperty(SelectedHeaderModalItemEnum.TEXT.toLowerCase()) && params['text']) {
      this.searchField.setValue(this.transformTextFromParams(params['text']), { emitEvent: false });
      this.searchTextTransformed = this.transformTextFromParams(params['text']);
    }
  }

  resetSearchLiveBooks(): void {
    this.searchLiveFacade.resetSearchLiveBooks();
  }

  moveToPage(routerLink: string): void {
    if (routerLink && routerLink !== '/logout') {
      this.router.navigate([routerLink]).then((): void => {});
    } else {
      this.logoutForGoogle();
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (
      this.allMiniModal &&
      !(
        (event.target as Element).closest('.header-search-modal') ||
        (event.target as Element).closest('.header-search-all')
      )
    ) {
      this.allMiniModal = false;
    }

    if (
      this.langMiniModal &&
      !(
        (event.target as Element).closest('.header-lang-modal') ||
        (event.target as Element).closest('.header-lang-info')
      )
    ) {
      this.langMiniModal = false;
    }

    if (
      this.profileMiniModal &&
      !(
        (event.target as Element).closest('.header-account-modal') ||
        (event.target as Element).closest('.header-account-info')
      )
    ) {
      this.profileMiniModal = false;
    }

    if (
      this.searchTexts$.value &&
      !(
        (event.target as Element).closest('.header-search-offers') ||
        (event.target as Element).closest('.header-search-input')
      )
    ) {
      this.searchTexts$.next(null);
      this.resetSearchLiveBooks();
    }
  }

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
