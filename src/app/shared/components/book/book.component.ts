import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BookItemTransformedInterface } from '../../../types/user';
import { Router } from '@angular/router';
import { ReduceLetterPipe } from '../../pipes';
import { TransformDateBookPipe } from '../../pipes';
import { NgClass, NgStyle } from '@angular/common';
import { TransformFavoriteDatePipe } from '../../pipes';
import { DatabaseService } from '../../services/database.service';
import { catchError, EMPTY, exhaustMap, finalize } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { NotificationService } from '../../services';
import { NotificationStatus } from '../../../types/auth';

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
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() book: BookItemTransformedInterface | null = null;
  @Input() bigInfo: boolean = false;
  @Input() selfBook: boolean = false;
  @Output() deleteSelfBookEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private notificationService: NotificationService
  ) {}

  openDetailBook(sizeBook: 'small-book' | 'big-book'): void {
    if (sizeBook === 'small-book' && !this.bigInfo) {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    } else if (sizeBook === 'big-book' && !this.selfBook) {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    } else if (this.selfBook) {
      console.log(this.book?.webReaderLink);
      this.readSelfBook();
    }
  }
  openGoogleInfo(): void {
    window.open(this.book?.webReaderLink, '_blank');
  }

  editSelfBook(): void {
    this.router.navigate(['/home/upload'], { queryParams: { id: this.book?.id } }).then(() => {});
  }

  deleteSelfBook(): void {
    this.notificationService.notifyAboutNotificationLoader(true);
    this.databaseService
      .deleteBookAndFile(this.book!.id, this.book!.webReaderLink, this.book!.thumbnail)
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

  readSelfBook() {}
}
