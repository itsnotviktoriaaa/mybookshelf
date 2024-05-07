import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IActions, IDetailBookSmallInfo, ISearchSmall } from '../../../modals/user';
import { DetailBookFacade } from '../../../ngrx/detail-book/detail-book.facade';
import { BehaviorSubject, Observable, of, Subject, takeUntil, tap } from 'rxjs';
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
export class DetailBookComponent implements OnInit, OnDestroy {
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
  private getParamsDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private detailBookFacade: DetailBookFacade,
    private authorFacade: AuthorFacade,
    private routerFacadeService: RouterFacadeService
  ) {}

  ngOnInit(): void {
    this.routerFacadeService.getParams$
      .pipe(takeUntil(this.getParamsDestroy$))
      .subscribe((params: Params): void => {
        this.miniLoader$.next({ miniLoader: true });
        const idOfBook = params['id'];
        console.log(idOfBook);
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
      });
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

  ngOnDestroy(): void {
    this.getParamsDestroy$.next();
    this.getParamsDestroy$.complete();
  }
}
