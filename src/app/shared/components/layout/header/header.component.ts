import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationStatus, UserInfoFromGoogle } from '../../../../types/auth';
import {
  HeaderClickInterface,
  SearchDetailInterface,
  SearchInterface,
} from '../../../../types/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthService, GoogleApiService } from '../../../../core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../../../services';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFacade } from '../../../../ngrx/search/search.facade';
import { ActiveParamsType, ActiveParamUtil } from '../../../utils/active-param.util';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;
  selectedHeaderModalItem = new BehaviorSubject<{ select: string } | null>(null);
  headerModalLangItems: string[] = ['Eng', 'Rus'];
  headerModalItems: string[] = ['All', 'Title', 'Author', 'Text', 'Subjects'];
  headerModalAccountItems: string[] = ['Profile', 'Favourite', 'My Books', 'Logout'];
  protected readonly HeaderClickInterfaceEnum = HeaderClickInterface;
  searchField: FormControl = new FormControl();
  searchTextTransformed: string = '';
  searchTexts$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  authServiceDestroy$: Subject<void> = new Subject<void>();
  userInfo$: BehaviorSubject<UserInfoFromGoogle | null> =
    new BehaviorSubject<UserInfoFromGoogle | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private googleApi: GoogleApiService,
    private searchFacade: SearchFacade,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedHeaderModalItem.next({ select: 'All' });
    this.googleApi.userProfileSubject.subscribe((info: UserInfoFromGoogle | null) => {
      if (info) {
        this.userInfo$.next(info);
      }
    });

    this.searchField.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string): void => {
        if (value && value.length > 4) {
          console.log(value);
          const transformedValue: string = this.transformSearchString(value);
          // this.searchStateService.setSearchString(transformedValue);
          this.searchTextTransformed = transformedValue;

          this.router.navigate([], { queryParams: { text: value } }).then(() => {
            this.activatedRoute.queryParams.subscribe((params: Params): void => {
              const newParams: ActiveParamsType = ActiveParamUtil.processParam(params);
              this.searchFacade.loadSearchBooks(newParams);
              this.searchFacade
                .getSearchBooks()
                .pipe(
                  map((data: SearchInterface | null) => {
                    if (data && data.items) {
                      return data.items.map((item: SearchDetailInterface): string => {
                        if (item.title) {
                          return item.title;
                        }
                        return '';
                      });
                    }
                    return [];
                  }),
                  map((data: string[]): string[] => {
                    const newArrayOfRequests = new Set<string>();
                    data.forEach((text: string): void => {
                      newArrayOfRequests.add(text);
                    });
                    return Array.from(newArrayOfRequests.values());
                  }),
                  tap((data: string[]): void => {
                    console.log(data);
                    this.searchTexts$.next(data);
                  })
                )
                .subscribe();
            });
          });
        }
      });
  }

  transformSearchString(value: string): string {
    return value.split(' ').join('+');
  }

  openOrCloseMiniModal(
    nameOfMiniModal:
      | HeaderClickInterface.allMiniModal
      | HeaderClickInterface.langMiniModal
      | HeaderClickInterface.profileMiniModal
  ): void {
    if (nameOfMiniModal === HeaderClickInterface.allMiniModal) {
      this.allMiniModal = !this.allMiniModal;
    }
    if (nameOfMiniModal === HeaderClickInterface.langMiniModal) {
      this.langMiniModal = !this.langMiniModal;
    }
    if (nameOfMiniModal === HeaderClickInterface.profileMiniModal) {
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
            status: NotificationStatus.success,
          });
          this.router.navigate(['/']).then(() => {});
        }),
        catchError(() => {
          this.notificationService.notifyAboutNotification({
            message: 'Success logout',
            status: NotificationStatus.success,
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
    this.selectedHeaderModalItem.next({ select: headerModalItem });
    this.allMiniModal = false;
    // console.log(this.selectedHeaderModalItem.getValue().select);
  }

  searchBooks(): void {
    //тут будет изменение url параметров
    // this.router
    //   .navigate(['/home/search'], {
    //     queryParams: {
    //       text: this.searchTextTransformed,
    //       type: this.selectedHeaderModalItem?.getValue().select.toLowerCase(),
    //     },
    //   })
    //   .then((): void => {});
  }

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
