import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared/components';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../types/user';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MiniModalComponent } from '../../../shared/components';
import { GoogleApiService } from '../../../core';
import { UserInfoFromGoogle } from '../../../types/auth';
import { HomeFacade } from '../../../ngrx/home/home.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, RouterLink, MiniModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  recommendedBooks$: BehaviorSubject<arrayFromBookItemTransformedInterface | null> =
    new BehaviorSubject<arrayFromBookItemTransformedInterface | null>(null);
  readingNowBooks$: BehaviorSubject<arrayFromBookItemTransformedInterface | null> =
    new BehaviorSubject<arrayFromBookItemTransformedInterface | null>(null);
  miniLoader$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });
  miniLoaderReading$: BehaviorSubject<{ miniLoader: boolean }> = new BehaviorSubject<{
    miniLoader: boolean;
  }>({ miniLoader: true });
  homeDestroy$: Subject<void> = new Subject<void>();
  // loading: boolean = true;
  constructor(
    private googleApi: GoogleApiService,
    private homeFacade: HomeFacade
  ) {}

  ngOnInit() {
    this.googleApi.userProfileSubject.subscribe((user: UserInfoFromGoogle | null) => {
      if (user) {
        this.homeFacade.loadRecommendedBooks(0);
        this.homeFacade
          .getRecommendedBooks()
          .pipe(
            tap((book: arrayFromBookItemTransformedInterface | null) => {
              console.log(book);
              this.recommendedBooks$.next(book);
              this.miniLoader$.next({ miniLoader: false });
            }),
            takeUntil(this.homeDestroy$)
          )
          .subscribe();

        this.homeFacade.loadReadingNowBooks(0);
        this.homeFacade
          .getReadingNowBooks()
          .pipe(
            tap((books: arrayFromBookItemTransformedInterface | null) => {
              this.readingNowBooks$.next(books);
              this.miniLoaderReading$.next({ miniLoader: false });
            })
          )
          .subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.homeDestroy$.next();
    this.homeDestroy$.complete();
  }
}
