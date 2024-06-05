import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SliderComponent } from 'components/slider/slider.component';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';
import { DestroyDirective, GoogleApiService } from 'core/';
import { IBookItemTransformedWithTotal } from 'models/';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleHomeComponent } from 'components/';
import { IUserInfoFromGoogle } from 'models/';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from 'components/';
import { MiniLoaderComponent } from 'ui/';
import { HomeFacade } from 'ngr/';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BookComponent,
    AsyncPipe,
    RouterLink,
    MiniLoaderComponent,
    GoogleHomeComponent,
    TranslateModule,
    SliderComponent,
  ],
  hostDirectives: [DestroyDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  isLoading$: Observable<boolean>;
  recommendedBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);
  readingNowBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);

  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private googleApi: GoogleApiService,
    private homeFacade: HomeFacade
  ) {
    this.isLoading$ = this.homeFacade.getLoadingOfRecommendedBooks();
  }

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((user: IUserInfoFromGoogle | null): void => {
      if (user) {
        this.homeFacade.loadRecommendedBooks(0);
        this.getRecommendedBooksObservable().subscribe();

        this.homeFacade.loadReadingNowBooks(0);
        this.getReadingNowBooksObservable().subscribe();
      }
    });
  }

  getRecommendedBooksObservable(): Observable<IBookItemTransformedWithTotal | null> {
    return this.homeFacade.getRecommendedBooks().pipe(
      tap((book: IBookItemTransformedWithTotal | null) => {
        this.recommendedBooks$.next(book);
      }),
      takeUntil(this.destroy$)
    );
  }

  getReadingNowBooksObservable(): Observable<IBookItemTransformedWithTotal | null> {
    return this.homeFacade.getReadingNowBooks().pipe(
      tap((books: IBookItemTransformedWithTotal | null) => {
        this.readingNowBooks$.next(books);
      }),
      takeUntil(this.destroy$)
    );
  }
}
