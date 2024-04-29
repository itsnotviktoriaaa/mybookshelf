import { GoogleApiService, NotificationService, TransformDateBookPipe } from '../../core';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { SearchDetailInterface } from '../../modals/user';
import { NotificationStatus } from '../../modals/auth';
import { SvgIconComponent } from 'angular-svg-icon';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-book',
  standalone: true,
  imports: [SvgIconComponent, TransformDateBookPipe, AsyncPipe],
  templateUrl: './search-book.component.html',
  styleUrl: './search-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent implements OnChanges {
  @Input() searchBook: SearchDetailInterface | null = null;
  @Input() idOfFavorites: string[] = [];
  isFavorite$ = new BehaviorSubject<boolean>(false);
  isOperationAddInProgress: boolean = false;
  isOperationRemoveInProgress: boolean = false;
  pathToIcons = environment.pathToIcons;

  constructor(
    private router: Router,
    private googleApiService: GoogleApiService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(): void {
    if (
      this.searchBook &&
      this.searchBook.id &&
      this.idOfFavorites &&
      this.idOfFavorites.length > 0
    ) {
      this.isFavorite$.next(this.idOfFavorites.includes(this.searchBook.id));
    }
  }

  openDetailPage(): void {
    if (this.searchBook?.id) {
      this.router.navigate(['/home/book/' + this.searchBook?.id]).then(() => {});
    }
  }

  addFavorite(): void {
    if (this.isOperationAddInProgress) {
      return;
    }

    if (this.searchBook?.id && this.searchBook.id) {
      this.isOperationAddInProgress = true;

      this.googleApiService
        .setFavoriteBook(this.searchBook.id)
        .pipe(
          tap((): void => {
            this.isFavorite$.next(true);
            this.notificationService.notifyAboutNotification({
              message: 'Success added',
              status: NotificationStatus.success,
            });
          }),
          catchError(() => {
            this.notificationService.notifyAboutNotification({
              message: 'Sth went wrong',
              status: NotificationStatus.error,
            });
            return EMPTY;
          }),
          finalize((): void => {
            this.isOperationAddInProgress = false;
          })
        )
        .subscribe();
    }
  }

  removeFavorite(): void {
    if (this.isOperationRemoveInProgress) {
      return;
    }

    if (this.searchBook?.id && this.searchBook.id) {
      this.isOperationRemoveInProgress = true;

      this.googleApiService
        .removeFavoriteBook(this.searchBook.id)
        .pipe(
          tap((): void => {
            this.isFavorite$.next(false);
            this.notificationService.notifyAboutNotification({
              message: 'Success removed',
              status: NotificationStatus.success,
            });
          }),
          catchError(() => {
            this.notificationService.notifyAboutNotification({
              message: 'Sth went wrong',
              status: NotificationStatus.error,
            });
            return EMPTY;
          }),
          finalize((): void => {
            this.isOperationRemoveInProgress = false;
          })
        )
        .subscribe();
    }
  }
}
