import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NotificationStatus } from '../../../../types/auth';
import { HeaderClickInterface } from '../../../../types/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthService } from '../../../../core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services';
import { UserInfoFromGoogle } from '../../../../types/auth';
import { GoogleApiService } from '../../../../core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchStateService } from '../../../services/search-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;
  headerModalLangItems: string[] = ['Eng', 'Rus'];
  headerModalItems: string[] = ['All', 'Title', 'Author', 'Text', 'Subjects'];
  headerModalAccountItems: string[] = ['Profile', 'Favourite', 'My Books', 'Logout'];
  protected readonly HeaderClickInterfaceEnum = HeaderClickInterface;
  searchField: FormControl = new FormControl();
  authServiceDestroy$: Subject<void> = new Subject<void>();
  userInfo$: BehaviorSubject<UserInfoFromGoogle | null> =
    new BehaviorSubject<UserInfoFromGoogle | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private googleApi: GoogleApiService,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((info: UserInfoFromGoogle | null) => {
      this.userInfo$.next(info);
    });

    this.searchField.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string): void => {
        if (value && value.length > 4) {
          console.log(value);
          const transformedValue: string = this.transformSearchString(value);
          this.searchStateService.setSearchString(transformedValue);
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
  }

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
