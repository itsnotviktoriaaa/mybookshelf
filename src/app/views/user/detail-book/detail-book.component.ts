import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadDetailBook } from '../../../ngrx/detail-book/detail-book.actions';
import { selectDetailBook } from '../../../ngrx/detail-book/detail-book.selector';
import { Observable, of, tap } from 'rxjs';
import { AuthorSmallInterface, DetailBookSmallInfo } from '../../../../types/user/book.interface';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TransformDateBookPipe } from '../../../shared/pipes/transform-date-book.pipe';
import { loadAuthor } from '../../../ngrx/author/author.actions';
import { selectAuthor } from '../../../ngrx/author/author.selector';
import { ReduceLetterPipe } from '../../../shared/pipes/reduce-letter.pipe';
import { MiniModalComponent } from '../../../shared/components/minimodal/minimodal.component';

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
  miniLoader: boolean = true;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.miniLoader = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const idOfBook = params['id'];
      console.log(idOfBook);
      this.store.dispatch(loadDetailBook({ idOfBook: idOfBook }));
      this.detailBook$ = this.store.select(selectDetailBook).pipe(
        tap((data: DetailBookSmallInfo | null) => {
          setTimeout(() => {
            this.miniLoader = false;
            this.cdr.detectChanges();
          }, 1000);
          if (data) {
            this.store.dispatch(loadAuthor({ author: data?.authors[0].split(' ').join('+').toLowerCase() }));
            this.author$ = this.store.select(selectAuthor);
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
    this.miniLoader = true;
    this.router.navigate(['/home/book', authorId]);
  }
}
