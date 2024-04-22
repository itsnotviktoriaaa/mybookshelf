import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationStatus, UserInfoFromGoogle } from '../../../../types/auth';
import { HeaderClickInterface } from '../../../../types/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthService, GoogleApiService } from '../../../../core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services';
import { AsyncPipe, NgStyle } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchStateService } from '../../../services/search-state.service';
import { SearchLiveFacade } from '../../../../ngrx/search-live/search-live.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, ReactiveFormsModule, FormsModule, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;
  selectedHeaderModalItem = new BehaviorSubject<string | null>(null);
  isFavoritePage$ = new BehaviorSubject<boolean>(false);
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
    this.searchStateService
      .getFavoritePage()
      .pipe(
        tap((param: boolean): void => {
          this.isFavoritePage$.next(param);
          this.selectedHeaderModalItem.next('All');
        })
      )
      .subscribe();

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
      .pipe(
        filter(value => {
          value = value.trim();
          if (!value) {
            this.searchTexts$.next(null);
            return false;
          }

          return true;
        }),
        map(value => value.trim()),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string): void => {
        this.searchTextTransformed = this.transformSearchString(value);

        // if (!value) {
        //   this.searchTexts$.next(null);
        // }

        if (value && value.length > 4 && !this.isFavoritePage$.getValue()) {
          if (this.selectedHeaderModalItem.getValue()!.toLowerCase() !== 'subject') {
            this.searchLiveFacade.loadSearchLiveBooks(
              value,
              this.selectedHeaderModalItem.getValue()!.toLowerCase()
            );

            this.searchLiveFacade
              .getSearchLiveBooks()
              .pipe(
                tap((data: string[] | null): void => {
                  console.log(data);
                  this.searchTexts$.next(data);
                })
              )
              .subscribe();
          }
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
      if (window.location.href.includes('favorites')) {
        return;
      }
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
    this.searchTexts$.next(null);

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
          console.log(categoryNew);
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

  chooseOfferFromLiveSearch(text: string): void {
    this.searchField.setValue(text, { emitEvent: false });
    this.searchTextTransformed = this.transformSearchString(text);
    this.searchTexts$.next(null);
  }

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
