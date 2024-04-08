import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { loadReadingNowBooks, loadRecommendedBooks } from '../../../ngrx/home/home.actions';
import { selectReadingNowBooks, selectRecommendedBooks } from '../../../ngrx/home/home.selectors';
import { Store } from '@ngrx/store';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { BookComponent } from '../../../shared';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActiveParamsType } from '../../../../types';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [BookComponent, AsyncPipe, NgClass, SvgIconComponent],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAllComponent implements OnInit {
  showBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  pages: number[] = [];
  startIndex: number = 0;
  maxLengthWhichGetFromBookApi: number = 40;
  activeParams: ActiveParamsType = { show: 'recommended' };
  @ViewChild('startSection') startSection!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const queryParams = params['show'];
      this.activeParams.show = queryParams === 'recommended' ? 'recommended' : queryParams === 'reading' ? 'reading' : 'recommended';
      if (Object.prototype.hasOwnProperty.call(params, 'page')) {
        this.activeParams.page = +params['page'];
        console.log(this.activeParams);
        this.definedStartIndex(+params['page']);
      } else {
        this.activeParams.page = 1;
      }
      this.loadBooks();
    });
  }

  loadBooks() {
    if (this.activeParams.show === 'recommended') {
      this.store.dispatch(loadRecommendedBooks({ startIndex: this.startIndex }));
      this.showBooks$ = this.store.select(selectRecommendedBooks).pipe(
        tap((showBooks: arrayFromBookItemTransformedInterface | null) => {
          this.definedQuantityOfPages(showBooks);
        })
      );
    } else if (this.activeParams.show === 'reading') {
      this.store.dispatch(loadReadingNowBooks({ startIndex: this.startIndex }));
      this.showBooks$ = this.store.select(selectReadingNowBooks).pipe(
        tap((showBooks: arrayFromBookItemTransformedInterface | null) => {
          this.definedQuantityOfPages(showBooks);
        })
      );
    }
  }

  definedQuantityOfPages(showBooks: arrayFromBookItemTransformedInterface | null): void {
    this.pages = [];
    if (showBooks) {
      if (showBooks && showBooks.totalItems <= 40) {
        this.pages.push(1);
      } else if (showBooks && showBooks.totalItems > 40) {
        const quantity: number = Math.ceil(showBooks.totalItems / 40);
        for (let i = 1; i <= quantity; i++) {
          this.pages.push(i);
        }
      }
    }
  }

  definedStartIndex(page?: number): void {
    if (page) {
      this.startIndex = page * this.maxLengthWhichGetFromBookApi - 40;
    } else {
      this.startIndex = 0;
    }
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router
      .navigate(['/home/show'], {
        queryParams: this.activeParams,
      })
      .then(() => {});
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router
        .navigate(['/home/show'], {
          queryParams: this.activeParams,
        })
        .then(() => {});
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router
        .navigate(['/home/show'], {
          queryParams: this.activeParams,
        })
        .then(() => {});
    }
  }
}
