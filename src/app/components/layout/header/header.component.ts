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
} from 'core/';
import {
  HeaderClickEnum,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from 'models/';
import { environment } from '../../../../environments/environment.development';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationStatusEnum, IUserInfoFromGoogle } from 'models/';
import { AsyncPipe, NgStyle } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { RouterFacadeService } from 'ngr/';
import { DestroyDirective } from 'core/';
import { SearchLiveFacade } from 'ngr/';
import { HeaderModalI } from 'models/';

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
      text: SelectedHeaderModalItemEngEnum.ALL,
      id: 'All',
    },
    {
      text: SelectedHeaderModalItemEngEnum.TITLE,
      id: 'Title',
    },
    {
      text: SelectedHeaderModalItemEngEnum.AUTHOR,
      id: 'Author',
    },
    {
      text: SelectedHeaderModalItemEngEnum.TEXT,
      id: 'Text',
    },
    {
      text: SelectedHeaderModalItemEngEnum.SUBJECT,
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
    const browserLang: string | undefined = this.translateService.currentLang;
    if (browserLang === 'ru') {
      this.lang.next('Русс');
      this.headerModalLangItems = ['Англ', 'Русс'];
      this.headerModalAccountItems = ['Профиль', 'Избранное', 'Мои книги', 'Выйти'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemRusEnum.ALL,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemRusEnum.TITLE,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemRusEnum.AUTHOR,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemRusEnum.TEXT,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemRusEnum.SUBJECT,
          id: 'Subject',
        },
      ];
      this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.ALL);
      this.searchStateService.setHeaderModalItem(SelectedHeaderModalItemRusEnum.ALL);
    } else if (browserLang === 'en') {
      this.lang.next('Eng');
      this.headerModalLangItems = ['Eng', 'Rus'];
      this.headerModalAccountItems = ['Profile', 'Favourite', 'My Books', 'Logout'];
      this.headerModalItems = [
        {
          text: SelectedHeaderModalItemEngEnum.ALL,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemEngEnum.TITLE,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemEngEnum.AUTHOR,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemEngEnum.TEXT,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemEngEnum.SUBJECT,
          id: 'Subject',
        },
      ];
      this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.ALL);
      this.searchStateService.setHeaderModalItem(SelectedHeaderModalItemEngEnum.ALL);
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
          text: SelectedHeaderModalItemEngEnum.ALL,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemEngEnum.TITLE,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemEngEnum.AUTHOR,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemEngEnum.TEXT,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemEngEnum.SUBJECT,
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
          text: SelectedHeaderModalItemRusEnum.ALL,
          id: 'All',
        },
        {
          text: SelectedHeaderModalItemRusEnum.TITLE,
          id: 'Title',
        },
        {
          text: SelectedHeaderModalItemRusEnum.AUTHOR,
          id: 'Author',
        },
        {
          text: SelectedHeaderModalItemRusEnum.TEXT,
          id: 'Text',
        },
        {
          text: SelectedHeaderModalItemRusEnum.SUBJECT,
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
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.ALL ||
      selectedHeaderModalItem === SelectedHeaderModalItemRusEnum.ALL
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.ALL);
      this.searchStateService.setHeaderModalItem(enumInAccordingToLang.ALL);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.TITLE ||
      selectedHeaderModalItem === SelectedHeaderModalItemRusEnum.TITLE
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.TITLE);
      this.searchStateService.setHeaderModalItem(enumInAccordingToLang.TITLE);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.AUTHOR ||
      selectedHeaderModalItem === SelectedHeaderModalItemRusEnum.AUTHOR
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.AUTHOR);
      this.searchStateService.setHeaderModalItem(enumInAccordingToLang.AUTHOR);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.TEXT ||
      selectedHeaderModalItem === SelectedHeaderModalItemRusEnum.TEXT
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.TEXT);
      this.searchStateService.setHeaderModalItem(enumInAccordingToLang.TEXT);
    }

    if (
      selectedHeaderModalItem === SelectedHeaderModalItemEngEnum.SUBJECT ||
      selectedHeaderModalItem === SelectedHeaderModalItemRusEnum.SUBJECT
    ) {
      this.selectedHeaderModalItem.next(enumInAccordingToLang.SUBJECT);
      this.searchStateService.setHeaderModalItem(enumInAccordingToLang.SUBJECT);
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
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.SUBJECT);
            } else if (currentLanguage === 'ru') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.SUBJECT);
            }
          }
        })
      )
      .subscribe();
  }

  subscribeOnQueryParams(): void {
    this.routerFacadeService.getQueryParams$
      .pipe(
        debounceTime(1),
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
        debounceTime(1),
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
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemEngEnum.ALL);
            }
            if (currentLanguage === 'ru') {
              this.selectedHeaderModalItem.next(SelectedHeaderModalItemRusEnum.ALL);
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
            !(
              this.selectedHeaderModalItem.getValue()!.toLowerCase() ===
                SelectedHeaderModalItemEngEnum.SUBJECT.toLowerCase() ||
              this.selectedHeaderModalItem.getValue()!.toLowerCase() ===
                SelectedHeaderModalItemRusEnum.SUBJECT.toLowerCase()
            )
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
          const messageKey = 'message.successLogout';
          const message = this.translateService.instant(messageKey);
          this.notificationService.notifyAboutNotification({
            message: message,
            status: NotificationStatusEnum.SUCCESS,
          });
          this.router.navigate(['/']).then(() => {});
        }),
        catchError(() => {
          const messageKey = 'message.successLogout';
          const message = this.translateService.instant(messageKey);
          this.notificationService.notifyAboutNotification({
            message: message,
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
              SelectedHeaderModalItemEngEnum.SUBJECT.toLowerCase() &&
            this.selectedHeaderModalItem.getValue()?.toLowerCase() !==
              SelectedHeaderModalItemRusEnum.SUBJECT.toLowerCase()
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

      const currentLanguage: string = this.translateService.currentLang;

      if (currentLanguage === 'en') {
        this.changedSelectedHeaderModalItemInAccordingToLanguage(
          transformValueToUpperCaseFromParams,
          'en'
        );
      } else if (currentLanguage === 'ru') {
        this.changedSelectedHeaderModalItemInAccordingToLanguage(
          transformValueToUpperCaseFromParams,
          'ru'
        );
      }
    }

    if (
      (params.hasOwnProperty(SelectedHeaderModalItemEngEnum.TEXT.toLowerCase()) ||
        params.hasOwnProperty(SelectedHeaderModalItemRusEnum.TEXT.toLowerCase())) &&
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
