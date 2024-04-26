import { GoogleApiService, NotificationService, TransformDateBookPipe } from '../../core';
import { NotificationStatus } from '../../modals/auth';
import { SearchDetailInterface } from '../../modals/user';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

@Component({
  selector: 'app-search-book',
  standalone: true,
  imports: [SvgIconComponent, TransformDateBookPipe],
  templateUrl: './search-book.component.html',
  styleUrl: './search-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent implements OnChanges {
  @Input() searchBook: SearchDetailInterface | null = null;
  @Input() idOfFavorites: string[] = [];
  isFavorite: boolean = false;
  isOperationAddInProgress: boolean = false;
  isOperationRemoveInProgress: boolean = false;

  constructor(
    private router: Router,
    private googleApiService: GoogleApiService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(): void {
    if (
      this.searchBook &&
      this.searchBook.id &&
      this.idOfFavorites &&
      this.idOfFavorites.length > 0
    ) {
      this.isFavorite = this.idOfFavorites.includes(this.searchBook.id);
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
            this.isFavorite = true;
            this.cdr.detectChanges();
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
            this.isFavorite = false;
            this.cdr.detectChanges();
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
