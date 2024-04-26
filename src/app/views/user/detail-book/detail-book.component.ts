import { ActionsInterface, DetailBookSmallInfo, SearchSmallInterface } from '../../../modals/user';
import { DetailBookFacade } from '../../../ngrx/detail-book/detail-book.facade';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MiniModalComponent, StarComponent } from '../../../UI-сomponents';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReduceLetterPipe, TransformDateBookPipe } from '../../../core';
import { AuthorFacade } from '../../../ngrx/author/author.facade';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
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
  ],
  templateUrl: './detail-book.component.html',
  styleUrl: './detail-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailBookComponent implements OnInit {
  rating: number = 0;

  actions: ActionsInterface[] = [
    { svg: 'review-icon.svg', title: 'Review' },
    { svg: 'notes-icon.svg', title: 'Notes' },
    { svg: 'share-icon.svg', title: 'Share' },
  ];

  author$: Observable<SearchSmallInterface | null> = of(null);
  detailBook$: Observable<DetailBookSmallInfo | null> = of(null);

  miniLoader$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private detailBookFacade: DetailBookFacade,
    private authorFacade: AuthorFacade
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.miniLoader$.next({ miniLoader: true });
      const idOfBook = params['id'];
      console.log(idOfBook);
      this.detailBookFacade.loadDetailBook(idOfBook);
      this.detailBook$ = this.detailBookFacade.getDetailBook().pipe(
        tap((data: DetailBookSmallInfo | null) => {
          this.miniLoader$.next({ miniLoader: false });
          if (data) {
            this.authorFacade.loadAuthor(this.search(data));
            this.author$ = this.authorFacade.getDetailBook();
            if (data.averageRating) {
              this.rating = Math.round(data.averageRating);
            }
          }
        })
      );
    });
  }

  search(data: DetailBookSmallInfo): string {
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
