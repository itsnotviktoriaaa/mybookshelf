import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { AuthorSmallInterface, DetailBookSmallInfo } from 'types/';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TransformDateBookPipe } from 'shared/';
import { ReduceLetterPipe } from 'shared/';
import { MiniModalComponent } from 'shared/';
import { DetailBookFacade } from 'ngr/';
import { AuthorFacade } from 'ngr/';

@Component({
  selector: 'app-detail-book',
  standalone: true,
  imports: [SvgIconComponent, NgClass, AsyncPipe, TransformDateBookPipe, ReduceLetterPipe, RouterLink, MiniModalComponent],
  templateUrl: './detail-book.component.html',
  styleUrl: './detail-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailBookComponent implements OnInit {
  detailBook$: Observable<DetailBookSmallInfo | null> = of(null);
  author$: Observable<AuthorSmallInterface | null> = of(null);
  rating: number | null | undefined = 0;
  miniLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private detailBookFacade: DetailBookFacade,
    private authorFacade: AuthorFacade
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.miniLoader$.next(true);
      const idOfBook = params['id'];
      console.log(idOfBook);
      this.detailBookFacade.loadDetailBook(idOfBook);
      this.detailBook$ = this.detailBookFacade.getDetailBook().pipe(
        tap((data: DetailBookSmallInfo | null) => {
          this.miniLoader$.next(false);
          if (data) {
            this.authorFacade.loadAuthor(data?.authors[0].split(' ').join('+').toLowerCase());
            this.author$ = this.authorFacade.getDetailBook();
            if (data.averageRating) {
              this.rating = Math.round(data.averageRating);
            }
          }
        })
      );
    });
  }

  openPageOnGoogle(url: string): void {
    window.open(url, '_blank');
  }

  openOtherBook(authorId: string) {
    this.miniLoader$.next(true);
    this.router.navigate(['/home/book', authorId]);
  }
}
