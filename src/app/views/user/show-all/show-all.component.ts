import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { loadReadingNowBooks, loadRecommendedBooks } from '../../../ngrx/home/home.actions';
import { selectReadingNowBooks, selectRecommendedBooks } from '../../../ngrx/home/home.selectors';
import { Store } from '@ngrx/store';
import { arrayFromBookItemTransformedInterface } from '../../../../types/user/book.interface';
import { BookComponent } from '../../../shared';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [BookComponent, AsyncPipe, NgIf],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
})
export class ShowAllComponent implements OnInit {
  query: string = 'recommended';
  showBooks$: Observable<arrayFromBookItemTransformedInterface | null> = of(null);
  pages: number[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit() {
    console.log('here');
    this.activatedRoute.queryParams.subscribe(params => {
      const queryParams = params['show'];
      this.query = queryParams === 'recommended' ? 'recommended' : queryParams === 'reading' ? 'reading' : 'recommended';
      this.loadBooks();
    });
  }

  loadBooks() {
    if (this.query === 'recommended') {
      this.store.dispatch(loadRecommendedBooks());
      this.showBooks$ = this.store.select(selectRecommendedBooks);
    } else if (this.query === 'reading') {
      this.store.dispatch(loadReadingNowBooks());
      this.showBooks$ = this.store.select(selectReadingNowBooks);
    }
  }

  // definedPages() {
  //   this.showBooks$.subscribe((showBooks: arrayFromBookItemTransformedInterface | null) => {
  //     if (showBooks && showBooks.totalItems <= 10) {
  //       this.pages.push(1);
  //     } else if (showBooks && showBooks.totalItems > 10) {
  //       const quantity: number = Math.ceil(showBooks.totalItems / 10);
  //       // for (let i = 1; i <= quantity; i++) {
  //       //   this.pages.push(i);
  //       // }
  //       console.log(quantity);
  //     }
  //   });
  // }

  // openPage(page: number) {
  //   this.activeParams.page = page;
  //   this.router.navigate(['/catalog'], {
  //     queryParams: this.activeParams,
  //   });
  // }
  //
  // openPrevPage() {
  //   if (this.activeParams.page && this.activeParams.page > 1) {
  //     this.activeParams.page--;
  //     this.router.navigate(['/catalog'], {
  //       queryParams: this.activeParams,
  //     });
  //   }
  // }
  //
  // openNextPage() {
  //   if (this.activeParams.page && this.activeParams.page < this.pages.length) {
  //     this.activeParams.page++;
  //     this.router.navigate(['/catalog'], {
  //       queryParams: this.activeParams,
  //     });
  //   }
  // }
}
