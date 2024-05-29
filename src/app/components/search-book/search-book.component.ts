import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { GoogleApiService, NotificationService, TransformDateBookPipe } from 'core/';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { NotificationStatusEnum } from 'models/';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ISearchDetail } from 'models/';

@Component({
  selector: 'app-search-book',
  standalone: true,
  imports: [SvgIconComponent, TransformDateBookPipe, AsyncPipe, TranslateModule],
  templateUrl: './search-book.component.html',
  styleUrl: './search-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent implements OnChanges {
  @Input() searchBook: ISearchDetail | null = null;
  @Input() idOfFavorites: string[] = [];
  isFavorite$ = new BehaviorSubject<boolean>(false);
  isOperationAddInProgress: boolean = false;
  isOperationRemoveInProgress: boolean = false;
  pathToIcons = environment.pathToIcons;

  constructor(
    private router: Router,
    private googleApiService: GoogleApiService,
    private notificationService: NotificationService,
    private translateService: TranslateService
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

  toggleFavorite(isAdding: boolean): void {
    if (
      (isAdding && this.isOperationAddInProgress) ||
      (!isAdding && this.isOperationRemoveInProgress)
    ) {
      return;
    }

    if (this.searchBook?.id && this.searchBook.id) {
      if (isAdding) {
        this.isOperationAddInProgress = true;
      } else {
        this.isOperationRemoveInProgress = true;
      }

      const operationObservable = isAdding
        ? this.googleApiService.setFavoriteBook(this.searchBook.id)
        : this.googleApiService.removeFavoriteBook(this.searchBook.id);

      operationObservable
        .pipe(
          tap(() => {
            this.isFavorite$.next(isAdding);
            const messageKey = isAdding ? 'message.successAdded' : 'message.successRemoved';
            const message = this.translateService.instant(messageKey);
            this.notificationService.sendNotification({
              message,
              status: NotificationStatusEnum.SUCCESS,
            });
          }),
          catchError(() => {
            const messageKey = 'message.somethingWentWrong';
            const message = this.translateService.instant(messageKey);
            this.notificationService.sendNotification({
              message: message,
              status: NotificationStatusEnum.ERROR,
            });
            return EMPTY;
          }),
          finalize(() => {
            this.isOperationAddInProgress = false;
            this.isOperationRemoveInProgress = false;
          })
        )
        .subscribe();
    }
  }

  addFavorite(): void {
    this.toggleFavorite(true);
  }

  removeFavorite(): void {
    this.toggleFavorite(false);
  }
}
