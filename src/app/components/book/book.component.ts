import {
  DatabaseService,
  NotificationService,
  ReduceLetterPipe,
  TransformDateBookPipe,
  TransformFavoriteDatePipe,
} from '../../core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonPopupComponent } from '../../UI-сomponents/common-popup/common-popup.component';
import { CommonPopupService } from '../../core/services/common-popup.service';
import { environment } from '../../../environments/environment.development';
import { FavoritesFacade } from '../../ngrx/favorites/favorites.facade';
import { catchError, EMPTY, exhaustMap, finalize, tap } from 'rxjs';
import { BookItemTransformedInterface } from '../../modals/user';
import { NotificationStatus } from '../../modals/auth';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass, NgStyle } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    ReduceLetterPipe,
    TransformDateBookPipe,
    NgStyle,
    TransformFavoriteDatePipe,
    NgClass,
    SvgIconComponent,
    CommonPopupComponent,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommonPopupService],
})
export class BookComponent implements OnInit {
  @Input() book: BookItemTransformedInterface | null = null;
  @Input() bigInfo: boolean = false;
  @Input() selfBook: boolean = false;
  @Output() deleteSelfBookEvent: EventEmitter<string> = new EventEmitter<string>();
  pathToIcons = environment.pathToIcons;
  isOpenDeletePopup = { isOpen: false };
  textForPopup = { text: 'Are you sure that you want to delete?' };
  page: 'own' | 'favorite' = 'own';

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private notificationService: NotificationService,
    private commonPopupService: CommonPopupService,
    private favoriteFacade: FavoritesFacade
  ) {}

  ngOnInit(): void {
    this.commonPopupService
      .getDeleteOwnBookOrNot()
      .pipe(
        tap((param: boolean): void => {
          if (param) {
            this.deleteSelfBook();
          }
        })
      )
      .subscribe();

    this.commonPopupService
      .getDeleteFavoriteBookOrNot()
      .pipe(
        tap((param: boolean): void => {
          if (param) {
            this.deleteFavoriteBook();
          }
        })
      )
      .subscribe();
  }

  openDetailBook(sizeBook: 'small-book' | 'big-book'): void {
    if (sizeBook === 'small-book' && !this.bigInfo) {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    } else if (sizeBook === 'big-book' && !this.selfBook) {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    } else if (sizeBook === 'big-book' && this.selfBook) {
      console.log(this.book?.webReaderLink);
      this.readSelfBook();
    }
  }
  openGoogleInfo(book: BookItemTransformedInterface): void {
    window.open(book.webReaderLink, '_blank');
  }

  editSelfBook(book: BookItemTransformedInterface): void {
    this.router.navigate(['/home/upload'], { queryParams: { id: book.id } }).then(() => {});
  }

  openDeletePopupForOwnBook(): void {
    this.textForPopup = { text: 'Are you sure that you want to delete this own book?' };
    this.page = 'own';
    this.isOpenDeletePopup = { isOpen: true };
  }

  deleteSelfBook(): void {
    if (this.book) {
      this.notificationService.notifyAboutNotificationLoader(true);
      this.databaseService
        .deleteBookAndFile(this.book.id, this.book.webReaderLink, this.book.thumbnail)
        .pipe(
          exhaustMap(() => {
            this.deleteSelfBookEvent.emit(this.book!.id);
            this.notificationService.notifyAboutNotification({
              message: 'Self book deleted successfully',
              status: NotificationStatus.success,
            });
            return EMPTY;
          }),
          catchError(() => {
            this.notificationService.notifyAboutNotification({
              message: 'Self book deleted with error',
              status: NotificationStatus.error,
            });
            return EMPTY;
          }),
          finalize(() => {
            this.notificationService.notifyAboutNotificationLoader(false);
          })
        )
        .subscribe();
    }
  }

  openPopupForDeletionFromFavorite(): void {
    this.page = 'favorite';
    this.textForPopup = { text: 'Are you sure that you want to delete from favorite?' };
    this.isOpenDeletePopup = { isOpen: true };
  }

  deleteFavoriteBook(): void {
    if (this.book && this.book.id) {
      this.favoriteFacade.loadRemoveFavoritesBooks(this.book.id);
    }
  }

  readSelfBook(): void {}
}
