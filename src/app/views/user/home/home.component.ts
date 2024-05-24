import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IBookItemTransformedWithTotal } from 'modals/';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleHomeComponent } from 'components/';
import { SubscribeDecorator } from 'decorators/';
import { IUserInfoFromGoogle } from 'modals/';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from 'components/';
import { MiniLoaderComponent } from 'ui/';
import { GoogleApiService } from 'core/';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  isLoading$: Observable<boolean>;
  recommendedBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);
  readingNowBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);
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

  @SubscribeDecorator()
  getRecommendedBooksObservable(): Observable<IBookItemTransformedWithTotal | null> {
    return this.homeFacade.getRecommendedBooks().pipe(
      tap((book: IBookItemTransformedWithTotal | null): void => {
        this.recommendedBooks$.next(book);
      })
    );
  }

  @SubscribeDecorator()
  getReadingNowBooksObservable(): Observable<IBookItemTransformedWithTotal | null> {
    return this.homeFacade.getReadingNowBooks().pipe(
      tap((books: IBookItemTransformedWithTotal | null): void => {
        this.readingNowBooks$.next(books);
      })
    );
  }
}
