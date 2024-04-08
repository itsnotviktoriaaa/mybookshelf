import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { Observable, of, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { selectReadingNowBooks, selectRecommendedBooks } from '../../../ngrx/home/home.selectors';
import { Store } from '@ngrx/store';
import { loadReadingNowBooks, loadRecommendedBooks } from '../../../ngrx/home/home.actions';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MiniModalComponent } from '../../../shared/components/minimodal/minimodal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, RouterLink, MiniModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  recommendedBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  readingNowBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  miniLoader: boolean = true;
  miniLoader1: boolean = true;
  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.miniLoader = true;
    this.miniLoader1 = true;
    this.store.dispatch(loadRecommendedBooks({ startIndex: 0 }));
    this.recommendedBooks$ = this.store.select(selectRecommendedBooks).pipe(
      tap(() => {
        setTimeout(() => {
          this.miniLoader = false;
          this.cdr.detectChanges();
        }, 1000);
      })
    );
    this.store.dispatch(loadReadingNowBooks({ startIndex: 0 }));
    this.readingNowBooks$ = this.store.select(selectReadingNowBooks).pipe(
      tap(() => {
        setTimeout(() => {
          this.miniLoader1 = false;
          this.cdr.detectChanges();
        }, 1000);
      })
    );
  }

  // для других компонентов
  // getBooks() {
  //   this.googleApi.getBooks().subscribe(data => {
  //     console.log(data);
  //   });
  // }
  //

  // setFavoriteBook() {
  //   this.googleApi.setFavoriteBook().subscribe(data => {
  //     console.log(data);
  //   });
  // }
}
