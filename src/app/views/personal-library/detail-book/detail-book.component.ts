import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { debounceTime, filter, Observable, of, takeUntil, tap } from 'rxjs';
import { IActions, IDetailBookSmallInfo, ISearchSmall } from 'app/models';
import { ReduceLetterPipe, TransformDateBookPipe } from 'app/core';
import { Params, Router, RouterLink } from '@angular/router';
import { MiniLoaderComponent, StarComponent } from 'ui/';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterFacadeService } from 'ngr/';
import { DestroyDirective } from 'core/';
import { DetailBookFacade } from 'ngr/';
import { AuthorFacade } from 'ngr/';

@Component({
  selector: 'app-detail-book',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgClass,
    AsyncPipe,
    TransformDateBookPipe,
    ReduceLetterPipe,
    RouterLink,
    MiniLoaderComponent,
    StarComponent,
    TranslateModule,
  ],
  templateUrl: './detail-book.component.html',
  styleUrl: './detail-book.component.scss',
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailBookComponent implements OnInit {
  rating: number = 0;

  actions: IActions[] = [
    { svg: 'review-icon.svg', title: 'Review' },
    { svg: 'notes-icon.svg', title: 'Notes' },
    { svg: 'share-icon.svg', title: 'Share' },
  ];

  author$: Observable<ISearchSmall | null> = of(null);
  detailBook$: Observable<IDetailBookSmallInfo | null> = of(null);

  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  isLoading$: Signal<boolean | undefined>;

  previousRouter: string | null = null;

  constructor(
    private router: Router,
    private detailBookFacade: DetailBookFacade,
    private authorFacade: AuthorFacade,
    private routerFacadeService: RouterFacadeService
  ) {
    this.isLoading$ = toSignal(this.detailBookFacade.getLoadingOfDetailBook());
  }

  ngOnInit(): void {
    this.routerFacadeService.getParams$
      .pipe(
        debounceTime(1),
        filter(params => params && params['id']),
        tap((params: Params) => {
          const idOfBook = params['id'];

          if (idOfBook) {
            this.detailBookFacade.loadDetailBook(idOfBook);
            this.detailBook$ = this.detailBookFacade.getDetailBook().pipe(
              tap((data: IDetailBookSmallInfo | null) => {
                if (data) {
                  this.authorFacade.loadAuthor(this.search(data), idOfBook);
                  this.author$ = this.authorFacade.getDetailBook();
                  if (data.averageRating) {
                    this.rating = Math.round(data.averageRating);
                  }
                }
              })
            );
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.routerFacadeService.getPreviousUrl$
      .pipe(
        tap((previousUrl: string | null) => {
          this.previousRouter = previousUrl;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  search(data: IDetailBookSmallInfo): string {
    return data.authors[0].split(' ').join('+').toLowerCase();
  }

  openPageOnGoogle(url: string): void {
    window.open(url, '_blank');
  }

  openOtherBook(authorId: string): void {
    this.router.navigate(['/home/book', authorId]).then((): void => {});
  }

  openSearchPageInAccordingToAuthor(author: string): void {
    this.router
      .navigate(['/home/search'], {
        queryParams: {
          text: author,
          type: 'author',
          category: 'browse',
        },
      })
      .then((): void => {});
  }

  navigateToPreviousUrl(): void {
    if (this.previousRouter) {
      const parts = this.previousRouter.split('?');
      const path = parts[0]; // путь к маршруту
      const queryParams = parts[1]
        ? parts[1].split('&').reduce((acc: Record<string, string>, param: string) => {
            const [key, value] = param.split('=');
            acc[key] = value;
            return acc;
          }, {})
        : {};

      if (queryParams && queryParams['text']) {
        this.changeNumberFromUrlToScape(queryParams, 'text');
      }

      if (queryParams && queryParams['category']) {
        this.changeNumberFromUrlToScape(queryParams, 'category');
      }

      this.router.navigate([path], { queryParams }).then((): void => {});
    } else {
      this.router.navigate(['/home']).then((): void => {});
    }
  }

  changeNumberFromUrlToScape(queryParams: Record<string, string>, key: string): void {
    if (
      queryParams[key] &&
      (queryParams[key].includes('%20') || queryParams[key].includes('%2B'))
    ) {
      queryParams[key] = queryParams[key].replace(/%20/g, ' ').replace(/%2B/g, ' ');
    }
  }
}
