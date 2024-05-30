import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ReduceLetterPipe, TransformDateBookPipe, TransformFavoriteDatePipe } from 'core/';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgClass, NgStyle } from '@angular/common';
import { IBookItemTransformed } from 'models/';
import { filter, takeUntil, tap } from 'rxjs';
import { CommonPopupService } from 'core/';
import { CommonPopupComponent } from 'ui/';
import { Router } from '@angular/router';
import { DestroyDirective } from 'core/';
import { FavoritesFacade } from 'ngr/';
import { FavouriteStore } from 'ngr/';
import { MyBooksFacade } from 'ngr/';

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
    TranslateModule,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommonPopupService],
})
export class BookComponent implements OnInit {
  @Input() book: IBookItemTransformed | null = null;
  @Input() bigInfo: boolean = false;
  @Input() selfBook: boolean = false;
  @Output() deleteSelfBookEvent: EventEmitter<string> = new EventEmitter<string>();
  pathToIcons = environment.pathToIcons;
  isOpenDeletePopup = { isOpen: false };
  textForPopup: { text: string } | null = null;
  page: 'own' | 'favorite' = 'own';
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  store = inject(FavouriteStore);

  constructor(
    private router: Router,
    private commonPopupService: CommonPopupService,
    private favoriteFacade: FavoritesFacade,
    private myBookFacade: MyBooksFacade,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.commonPopupService
      .getDeleteOwnBookOrNot()
      .pipe(
        filter(param => param),
        tap((): void => {
          this.deleteSelfBook();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.commonPopupService
      .getDeleteFavoriteBookOrNot()
      .pipe(
        filter(param => param),
        tap((): void => {
          this.deleteFavoriteBook();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  openDetailBook(sizeBook: 'small-book' | 'big-book', book: IBookItemTransformed): void {
    if (sizeBook === 'small-book' && !this.bigInfo) {
      this.router.navigate(['home/book/', book.id]).then((): void => {});
    } else if (sizeBook === 'big-book' && !this.selfBook) {
      this.router.navigate(['home/book/', book.id]).then((): void => {});
    } else if (sizeBook === 'big-book' && this.selfBook) {
      this.router.navigate(['/home/reader/' + book?.id]).then((): void => {});
    }
  }
  openGoogleInfo(book: IBookItemTransformed): void {
    window.open(book.webReaderLink, '_blank');
  }

  editSelfBook(book: IBookItemTransformed): void {
    this.router.navigate(['/home/upload'], { queryParams: { id: book.id } }).then(() => {});
  }

  openDeletePopupForOwnBook(): void {
    const messageKey = 'modal.confirmDeleteOwnBook';
    const message = this.translateService.instant(messageKey);
    this.textForPopup = { text: message };
    this.page = 'own';
    this.isOpenDeletePopup = { isOpen: true };
  }

  deleteSelfBook(): void {
    if (this.book) {
      this.myBookFacade.loadRemoveMyBook(
        this.book.id,
        this.book.webReaderLink,
        this.book.thumbnail
      );
    }
  }

  openPopupForDeletionFromFavorite(): void {
    this.page = 'favorite';
    const messageKey = 'modal.confirmDeleteFavorite';
    const message = this.translateService.instant(messageKey);
    this.textForPopup = { text: message };
    this.isOpenDeletePopup = { isOpen: true };
  }

  deleteFavoriteBook(): void {
    if (this.book && this.book.id) {
      this.store.deleteLoadFavoriteBook(this.book.id);
    }
  }
}
