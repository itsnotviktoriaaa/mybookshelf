import { Component, HostListener, OnDestroy } from '@angular/core';
import { HeaderClickInterface, NotificationStatus } from '../../../../../types';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthService } from '../../../../core';
import { catchError, EMPTY, Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;
  protected readonly HeaderClickInterfaceEnum = HeaderClickInterface;
  authServiceDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  openOrCloseMiniModal(nameOfMiniModal: HeaderClickInterface.allMiniModal | HeaderClickInterface.langMiniModal | HeaderClickInterface.profileMiniModal): void {
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
          this.notificationService.notifyAboutNotification({ message: 'Success logout', status: NotificationStatus.success });
          this.router.navigate(['/']).then(() => {});
        }),
        catchError(() => {
          this.notificationService.notifyAboutNotification({ message: 'Success logout', status: NotificationStatus.success });
          this.router.navigate(['/']).then(() => {});
          return EMPTY;
        }),
        takeUntil(this.authServiceDestroy$)
      )
      .subscribe();
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    console.log(event.target);
    if (this.allMiniModal && !((event.target as Element).closest('.header-search-modal') || (event.target as Element).closest('.header-search-all'))) {
      this.allMiniModal = false;
    }

    if (this.langMiniModal && !((event.target as Element).closest('.header-lang-modal') || (event.target as Element).closest('.header-lang-info'))) {
      this.langMiniModal = false;
    }

    if (this.profileMiniModal && !((event.target as Element).closest('.header-account-modal') || (event.target as Element).closest('.header-account-info'))) {
      this.profileMiniModal = false;
    }
  }

  ngOnDestroy(): void {
    this.authServiceDestroy$.next();
    this.authServiceDestroy$.complete();
  }
}
