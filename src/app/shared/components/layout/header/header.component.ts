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
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchStateService } from '../../../services/search-state.service';
import { SearchLiveFacade } from '../../../../ngrx/search-live/search-live.facade';

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
  selectedHeaderModalItem = new BehaviorSubject<string | null>(null);
  headerModalLangItems: string[] = ['Eng', 'Rus'];
  headerModalItems: string[] = ['All', 'Title', 'Author', 'Text', 'Subject'];
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
    private searchLiveFacade: SearchLiveFacade,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.selectedHeaderModalItem.next('All');
    this.googleApi.userProfileSubject.subscribe((info: UserInfoFromGoogle | null) => {
      if (info) {
        this.userInfo$.next(info);
      }
    });

    this.searchStateService
      .getSearchCategory()
      .pipe(
        tap((category: string): void => {
          if (category.toLowerCase() !== 'browse') {
            this.selectedHeaderModalItem.next('Subject');
          } else {
            this.selectedHeaderModalItem.next('All');
          }
        })
      )
      .subscribe();

    this.searchField.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string): void => {
        this.searchTextTransformed = this.transformSearchString(value);
        if (value && value.length > 4) {
          this.searchLiveFacade.loadSearchLiveBooks(
            value,
            this.selectedHeaderModalItem.getValue()!.toLowerCase()
          );
          this.searchLiveFacade
            .getSearchLiveBooks()
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
                // console.log(data);
                this.searchTexts$.next(data);
              })
            )
            .subscribe();
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
    this.selectedHeaderModalItem.next(headerModalItem);
    this.searchStateService.setHeaderModalItem(headerModalItem);

    this.allMiniModal = false;
  }

  searchBooks(): void {
    console.log('YYYY');
    this.searchStateService
      .getSearchCategory()
      .pipe(
        take(1),
        tap((category: string): void => {
          let categoryNew: string = category;
          if (!window.location.href.includes('search')) {
            categoryNew = 'computers';
          }
          if (this.selectedHeaderModalItem.getValue()?.toLowerCase() !== 'subject') {
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

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
