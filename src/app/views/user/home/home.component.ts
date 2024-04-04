import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { GoogleApiService } from '../../../core/auth/google-api.service';
import { Observable, of } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { selectReadingNowBooks, selectRecommendedBooks } from '../../../ngrx/home/home.selectors';
import { Store } from '@ngrx/store';
import { loadReadingNowBooks, loadRecommendedBooks } from '../../../ngrx/home/home.actions';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  recommendedBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  readingNowBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  constructor(
    private googleApi: GoogleApiService,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(loadRecommendedBooks({ startIndex: 0 }));
    this.recommendedBooks$ = this.store.select(selectRecommendedBooks);
    this.store.dispatch(loadReadingNowBooks());
    this.readingNowBooks$ = this.store.select(selectReadingNowBooks);
  }

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
