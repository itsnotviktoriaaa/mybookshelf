import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BookComponent } from 'shared/';
import { BehaviorSubject, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from 'types/';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MiniModalComponent } from 'shared/';
import { GoogleApiService } from 'core/';
import { UserInfoFromGoogle } from 'types/';
import { HomeFacade } from 'ngr/';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, RouterLink, MiniModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  recommendedBooks$: BehaviorSubject<arrayFromBookItemTransformedInterface | null> = new BehaviorSubject<arrayFromBookItemTransformedInterface | null>(null);
  readingNowBooks$: BehaviorSubject<arrayFromBookItemTransformedInterface | null> = new BehaviorSubject<arrayFromBookItemTransformedInterface | null>(null);
  miniLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  miniLoader1$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  // loading: boolean = true;
  constructor(
    private googleApi: GoogleApiService,
    private homeFacade: HomeFacade
  ) {}

  ngOnInit() {
    this.miniLoader$.next(true);
    this.miniLoader1$.next(true);
    this.googleApi.userProfileSubject.subscribe((user: UserInfoFromGoogle | null) => {
      if (user) {
        this.homeFacade.loadRecommendedBooks(0);
        this.homeFacade
          .getRecommendedBooks()
          .pipe(
            tap((book: arrayFromBookItemTransformedInterface | null) => {
              console.log(book);
              this.recommendedBooks$.next(book);
              this.miniLoader$.next(false);
            })
          )
          .subscribe();

        // this.store.select(selectLoading).subscribe(loading => {
        //   if (!loading) {
        //     this.loading = loading;
        //     console.log(loading);
        //   }
        // });

        this.homeFacade.loadReadingNowBooks(0);
        this.homeFacade
          .getReadingNowBooks()
          .pipe(
            tap((books: arrayFromBookItemTransformedInterface | null) => {
              this.readingNowBooks$.next(books);
              this.miniLoader1$.next(false);
            })
          )
          .subscribe();
      }
    });
  }
}
