import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { IActiveParams, IBookItemTransformedWithTotal } from 'modals/';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, takeUntil, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { BookComponent } from 'components/';
import { RouterFacadeService } from 'ngr/';
import { MiniLoaderComponent } from 'ui/';
import { DestroyDirective } from 'core/';
import { SearchAllEnum } from 'modals/';
import { HomeFacade } from 'ngr/';

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [
    BookComponent,
    AsyncPipe,
    NgClass,
    SvgIconComponent,
    MiniLoaderComponent,
    TranslateModule,
  ],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAllComponent implements OnInit {
  pages: number[] = [];
  startIndex: number = 0;
  maxLengthWhichGetFromBookApi: number = 40;
  activeParams: IActiveParams = { show: 'recommended' };

  showBooks$: Observable<IBookItemTransformedWithTotal | null> = of(null);

  pathToIcons = environment.pathToIcons;
  private readonly destroy$ = inject(DestroyDirective).destroy$;
  isLoading$: Observable<boolean>;

  constructor(
    private router: Router,
    private homeFacade: HomeFacade,
    private routerFacadeService: RouterFacadeService
  ) {
    this.isLoading$ = this.homeFacade.getLoadingOfRecommendedBooks();
  }

  ngOnInit(): void {
    this.routerFacadeService.getQueryParams$
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
        const queryParams = params['show'];
        this.activeParams.show =
          queryParams === SearchAllEnum.recommended
            ? SearchAllEnum.recommended
            : queryParams === SearchAllEnum.reading
              ? SearchAllEnum.reading
              : SearchAllEnum.recommended;

        if (this.activeParams.show === SearchAllEnum.reading) {
          this.isLoading$ = this.homeFacade.getLoadingOfReadingNowBooks();
        }
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
    if (this.activeParams.show === SearchAllEnum.recommended) {
      this.homeFacade.loadRecommendedBooks(this.startIndex);
      this.showBooks$ = this.homeFacade.getRecommendedBooks().pipe(
        tap((showBooks: IBookItemTransformedWithTotal | null) => {
          console.log(showBooks);

          this.definedQuantityOfPages(showBooks);
        })
      );
    } else if (this.activeParams.show === SearchAllEnum.reading) {
      this.homeFacade.loadReadingNowBooks(this.startIndex);
      this.showBooks$ = this.homeFacade.getReadingNowBooks().pipe(
        tap((showBooks: IBookItemTransformedWithTotal | null) => {
          console.log(showBooks);
          this.definedQuantityOfPages(showBooks);
        })
      );
    }
  }

  definedQuantityOfPages(showBooks: IBookItemTransformedWithTotal | null): void {
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
    this.router
      .navigate(['/home/show'], {
        queryParams: this.activeParams,
      })
      .then((): void => {});
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router
        .navigate(['/home/show'], {
          queryParams: this.activeParams,
        })
        .then((): void => {});
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router
        .navigate(['/home/show'], {
          queryParams: this.activeParams,
        })
        .then((): void => {});
    }
  }
}
