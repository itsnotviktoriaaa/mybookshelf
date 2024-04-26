import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../types/user';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActiveParamsType } from '../../../types/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { HomeFacade } from '../../../ngrx/home/home.facade';
import { MiniModalComponent } from '../../../UI-сomponents';
import { BookComponent } from '../../../components';

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [BookComponent, AsyncPipe, NgClass, SvgIconComponent, MiniModalComponent],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAllComponent implements OnInit {
  pages: number[] = [];
  startIndex: number = 0;
  maxLengthWhichGetFromBookApi: number = 40;
  activeParams: ActiveParamsType = { show: 'recommended' };

  showBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);

  miniLoader$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private homeFacade: HomeFacade
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const queryParams = params['show'];
      this.activeParams.show =
        queryParams === 'recommended'
          ? 'recommended'
          : queryParams === 'reading'
            ? 'reading'
            : 'recommended';
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

  loadBooks(): void {
    this.miniLoader$.next({ miniLoader: true });
    if (this.activeParams.show === 'recommended') {
      this.homeFacade.loadRecommendedBooks(this.startIndex);
      this.showBooks$ = this.homeFacade.getRecommendedBooks().pipe(
        tap((showBooks: arrayFromBookItemTransformedInterface | null) => {
          console.log(showBooks);
          this.miniLoader$.next({ miniLoader: false });
          console.log(this.miniLoader$.getValue());
          this.definedQuantityOfPages(showBooks);
        })
      );
    } else if (this.activeParams.show === 'reading') {
      this.homeFacade.loadReadingNowBooks(this.startIndex);
      this.showBooks$ = this.homeFacade.getReadingNowBooks().pipe(
        tap((showBooks: arrayFromBookItemTransformedInterface | null) => {
          this.miniLoader$.next({ miniLoader: false });
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

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/home/show'], {
      queryParams: this.activeParams,
    });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router
        .navigate(['/home/show'], {
          queryParams: this.activeParams,
        })
        .then(() => {});
    }
  }

  openNextPage(): void {
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
