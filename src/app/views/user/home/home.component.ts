import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { Observable, of } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { selectReadingNowBooks, selectRecommendedBooks } from '../../../ngrx/home/home.selectors';
import { Store } from '@ngrx/store';
import { loadReadingNowBooks, loadRecommendedBooks } from '../../../ngrx/home/home.actions';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  recommendedBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  readingNowBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadRecommendedBooks({ startIndex: 0 }));
    this.recommendedBooks$ = this.store.select(selectRecommendedBooks);
    this.store.dispatch(loadReadingNowBooks({ startIndex: 0 }));
    this.readingNowBooks$ = this.store.select(selectReadingNowBooks);
  }

  // для других компонентов
  // getBooks() {
  //   this.googleApi.getBooks().subscribe(data => {
  //     console.log(data);
  //   });
  // }
  //
  // getFavorites() {
  //   this.googleApi.getFavorites().subscribe(data => {
  //     console.log(data);
  //   });
  // }

  // setFavoriteBook() {
  //   this.googleApi.setFavoriteBook().subscribe(data => {
  //     console.log(data);
  //   });
  // }
}
