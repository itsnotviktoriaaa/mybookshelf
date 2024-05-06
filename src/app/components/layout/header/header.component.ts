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
  AuthService,
  CategoryModalSearchItems,
  GoogleApiService,
  NotificationService,
  SearchStateService,
} from '../../../core';
import {
  HeaderClickEnum,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from '../../../modals/user';
import { NotificationStatusEnum, IUserInfoFromGoogle } from '../../../modals/auth';
import { SearchLiveFacade } from '../../../ngrx/search-live/search-live.facade';
import { environment } from '../../../../environments/environment.development';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderModalI } from '../../../modals/user/header.interface';
import { AsyncPipe, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';

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
  selectedHeaderModalItem = new BehaviorSubject<string | null>(null);
  isFavoritePage$ = new BehaviorSubject<boolean>(false);
  paramsFromUrl: Params = {};
  headerModalLangItems = ['Eng', 'Rus'];
  headerModalItems: HeaderModalI[] = [
    {
      text: SelectedHeaderModalItemEngEnum.All,
      id: 'All',
    },
    {
      text: SelectedHeaderModalItemEngEnum.Title,
      id: 'Title',
    },
    {
      text: SelectedHeaderModalItemEngEnum.Author,
      id: 'Author',
    },
    {
      text: SelectedHeaderModalItemEngEnum.Text,
      id: 'Text',
    },
    {
      text: SelectedHeaderModalItemEngEnum.Subject,
      id: 'Subject',
    },
  ];

  headerModalAccountItems: string[] = ['Profile', 'Favourite', 'My Books', 'Logout'];
  protected readonly HeaderClickInterfaceEnum = HeaderClickEnum;
  searchField: FormControl = new FormControl();
  searchTextTransformed: string = '';
  searchTexts$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  authServiceDestroy$: Subject<void> = new Subject<void>();
  userInfo$ = new BehaviorSubject<IUserInfoFromGoogle | null>(null);
  pathToIcons = environment.pathToIcons;
  existUrl: string | null = null;
  lang = new BehaviorSubject('Eng');
  private readonly destroy$ = inject(DestroyDirective).destroy$;
  @ViewChild('burger') burger: ElementRef | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private googleApi: GoogleApiService,
    private searchLiveFacade: SearchLiveFacade,
    private searchStateService: SearchStateService,
    private routerFacadeService: RouterFacadeService,
    private translateService: TranslateService
  ) {
    const browserLang: string | undefined = this.translateService.getBrowserLang();
    if (browserLang === 'ru') {
      this.lang.next('Русс');
      this.headerModalLangItems = ['Англ', 'Русс'];
      this.headerModalAccountItems = ['Профиль', 'Избранное', 'Мои книги', 'Выйти'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemRusEnum.All,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Title,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Author,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Text,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Subject,
          id: 'Subject',
        },
      ];
      this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.All);
      this.searchStateService.setHeaderModalItem(SelectedHeaderModalItemRusEnum.All);
    } else if (browserLang === 'en') {
      this.lang.next('Eng');
      this.headerModalLangItems = ['Eng', 'Rus'];
      this.headerModalAccountItems = ['Profile', 'Favourite', 'My Books', 'Logout'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemEngEnum.All,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Title,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Author,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Text,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Subject,
          id: 'Subject',
        },
      ];
      this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.All);
      this.searchStateService.setHeaderModalItem(SelectedHeaderModalItemEngEnum.All);
    }
  }

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((info: IUserInfoFromGoogle | null): void => {
      if (info) {
        this.userInfo$.next(info);
      }
    });

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
    if (lang === 'Eng' || lang === 'Англ') {
      this.translateService.use('en');
      this.lang.next('Eng');
      this.headerModalLangItems = ['Eng', 'Rus'];
      this.headerModalAccountItems = ['Profile', 'Favourite', 'My Books', 'Logout'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemEngEnum.All,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Title,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Author,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Text,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemEngEnum.Subject,
          id: 'Subject',
        },
      ];

      const selectedHeaderModalItem: string | null = this.selectedHeaderModalItem.value;
      if (selectedHeaderModalItem) {
        this.changedSelectedHeaderModalItemInAccordingToLanguage(selectedHeaderModalItem, 'en');
      }
    }

    if (lang === 'Rus' || lang === 'Русс') {
      this.translateService.use('ru');
      this.lang.next('Русс');
      this.headerModalLangItems = ['Англ', 'Русс'];
      this.headerModalAccountItems = ['Профиль', 'Избранное', 'Мои книги', 'Выйти'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemRusEnum.All,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Title,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Author,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Text,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemRusEnum.Subject,
          id: 'Subject',
        },
      ];

      const selectedHeaderModalItem: string | null = this.selectedHeaderModalItem.value;
      if (selectedHeaderModalItem) {
        this.changedSelectedHeaderModalItemInAccordingToLanguage(selectedHeaderModalItem, 'ru');
      }
    }
  }

  changedSelectedHeaderModalItemInAccordingToLanguage(
    selectedHeaderModalItem: string,
    lang: 'en' | 'ru'
  ): void {
    const enumInAccordingToLang =
      lang === 'en' ? SelectedHeaderModalItemEngEnum : SelectedHeaderModalItemRusEnum;
    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.All ||
      SelectedHeaderModalItemRusEnum.All
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.All);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.Title ||
      SelectedHeaderModalItemRusEnum.Title
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.Title);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.Author ||
      SelectedHeaderModalItemRusEnum.Author
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.Author);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.Text ||
      SelectedHeaderModalItemRusEnum.Text
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.Text);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.Subject ||
      SelectedHeaderModalItemRusEnum.Subject
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.Subject);
    }
  }

  getSearchCategory(): void {
    this.searchStateService
      .getSearchCategory()
      .pipe(
        tap((category: string): void => {
          if (category.toLowerCase() !== 'browse') {
            const currentLanguage: string = this.translateService.currentLang;
            if (currentLanguage === 'en') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.Subject);
            } else if (currentLanguage === 'ru') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.Subject);
            }
          }
        })
      )
      .subscribe();
  }

  subscribeOnQueryParams(): void {
    this.routerFacadeService.getQueryParams$
      .pipe(
        tap((params: Params): void => {
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
        tap((url: string): void => {
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
        tap((param: boolean): void => {
          this.isFavoritePage$.next(param);
          if (!this.paramsFromUrl['type']) {
            const currentLanguage: string = this.translateService.currentLang;
            if (currentLanguage === 'en') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.All);
            }
            if (currentLanguage === 'ru') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.All);
            }
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
            (this.selectedHeaderModalItem.getValue()!.toLowerCase() !==
              SelectedHeaderModalItemEngEnum.Subject.toLowerCase() ||
              this.selectedHeaderModalItem.getValue()!.toLowerCase() !==
                SelectedHeaderModalItemRusEnum.Subject.toLowerCase())
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
        console.log(data);
        this.searchTexts$.next(data);
      });
  }

  transformSearchString(value: string): string {
    return value.split(' ').join('+');
  }

  transformTextFromParams(value: string): string {
    return value.split('+').join(' ');
  }

  openOrCloseMiniModal(
    nameOfMiniModal:
      | HeaderClickEnum.allMiniModal
      | HeaderClickEnum.langMiniModal
      | HeaderClickEnum.profileMiniModal
  ): void {
    if (nameOfMiniModal === HeaderClickEnum.allMiniModal) {
      if (this.existUrl?.includes('favorites')) {
        return;
      }
      this.allMiniModal = !this.allMiniModal;
    }
    if (nameOfMiniModal === HeaderClickEnum.langMiniModal) {
      this.langMiniModal = !this.langMiniModal;
    }
    if (nameOfMiniModal === HeaderClickEnum.profileMiniModal) {
      this.profileMiniModal = !this.profileMiniModal;
    }
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.notificationService.notifyAboutNotification({
            message: 'Success logout',
            status: NotificationStatusEnum.success,
          });
          this.router.navigate(['/']).then(() => {});
        }),
        catchError(() => {
          this.notificationService.notifyAboutNotification({
            message: 'Success logout',
            status: NotificationStatusEnum.success,
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

  changeSelectedHeaderModalItem(headerModalItem: HeaderModalI): void {
    this.selectedHeaderModalItem.next(headerModalItem.text);
    this.searchStateService.setHeaderModalItem(headerModalItem.id);

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
        tap((category: string): void => {
          let categoryNew: string = category;
          if (!this.existUrl?.includes('search')) {
            categoryNew = CategoryModalSearchItems[1];
          }
          if (
            this.selectedHeaderModalItem.getValue()?.toLowerCase() !==
              SelectedHeaderModalItemEngEnum.Subject.toLowerCase() &&
            this.selectedHeaderModalItem.getValue()?.toLowerCase() !==
              SelectedHeaderModalItemRusEnum.Subject.toLowerCase()
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

    if (
      (params.hasOwnProperty(SelectedHeaderModalItemEngEnum.Text.toLowerCase()) ||
        params.hasOwnProperty(SelectedHeaderModalItemRusEnum.Text.toLowerCase())) &&
      (params['text'] || params['текст'])
    ) {
      const stringOfParams = params['text'] ? 'text' : 'текст';
      this.searchField.setValue(this.transformTextFromParams(params[stringOfParams]), {
        emitEvent: false,
      });
      this.searchTextTransformed = this.transformTextFromParams(params[stringOfParams]);
    }
  }

  resetSearchLiveBooks(): void {
    this.searchLiveFacade.resetSearchLiveBooks();
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
