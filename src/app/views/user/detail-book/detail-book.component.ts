import { BehaviorSubject, debounceTime, Observable, of, takeUntil, tap } from 'rxjs';
import { IActions, IDetailBookSmallInfo, ISearchSmall } from '../../../modals/user';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DetailBookFacade } from '../../../ngrx/detail-book/detail-book.facade';
import { environment } from '../../../../environments/environment.development';
import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { MiniModalComponent, StarComponent } from '../../../UI-сomponents';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { ReduceLetterPipe, TransformDateBookPipe } from '../../../core';
import { AuthorFacade } from '../../../ngrx/author/author.facade';
import { Params, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';

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
    MiniModalComponent,
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

  miniLoader$ = new BehaviorSubject<{ miniLoader: boolean }>({ miniLoader: true });
  pathToIcons = environment.pathToIcons;
  pathToImages = environment.pathToImages;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private router: Router,
    private detailBookFacade: DetailBookFacade,
    private authorFacade: AuthorFacade,
    private routerFacadeService: RouterFacadeService
  ) {}

  ngOnInit(): void {
    this.routerFacadeService.getParams$
      .pipe(
        debounceTime(1),
        tap((params: Params): void => {
          this.miniLoader$.next({ miniLoader: true });
          const idOfBook = params['id'];
          console.log(idOfBook);
          if (idOfBook) {
            this.detailBookFacade.loadDetailBook(idOfBook);
            this.detailBook$ = this.detailBookFacade.getDetailBook().pipe(
              tap((data: IDetailBookSmallInfo | null) => {
                this.miniLoader$.next({ miniLoader: false });
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
  }

  search(data: IDetailBookSmallInfo): string {
    return data.authors[0].split(' ').join('+').toLowerCase();
  }

  openPageOnGoogle(url: string): void {
    window.open(url, '_blank');
  }

  openOtherBook(authorId: string): void {
    this.miniLoader$.next({ miniLoader: true });
    this.router.navigate(['/home/book', authorId]).then((): void => {});
  }
}
