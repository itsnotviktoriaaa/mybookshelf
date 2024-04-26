import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface } from '../../../types/user';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoogleApiService } from '../../../core';
import { UserInfoFromGoogle } from '../../../types/auth';
import { HomeFacade } from '../../../ngrx/home/home.facade';
import { SubscribeDecorator } from '../../../decorators/subscribe-decorator';
import { MiniModalComponent } from '../../../UI-сomponents';
import { GoogleHomeComponent } from '../../../components';
import { BookComponent } from '../../../components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, AsyncPipe, RouterLink, MiniModalComponent, GoogleHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
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

  constructor(
    private googleApi: GoogleApiService,
    private homeFacade: HomeFacade
  ) {}

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((user: UserInfoFromGoogle | null) => {
      if (user) {
        this.homeFacade.loadRecommendedBooks(0);
        this.getRecommendedBooksObservable().subscribe();

        this.homeFacade.loadReadingNowBooks(0);
        this.getReadingNowBooksObservable().subscribe();
      }
    });
  }

  @SubscribeDecorator()
  getRecommendedBooksObservable(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.homeFacade.getRecommendedBooks().pipe(
      tap((book: arrayFromBookItemTransformedInterface | null) => {
        console.log(book);
        this.recommendedBooks$.next(book);
        this.miniLoader$.next({ miniLoader: false });
      })
    );
  }

  @SubscribeDecorator()
  getReadingNowBooksObservable(): Observable<arrayFromBookItemTransformedInterface | null> {
    return this.homeFacade.getReadingNowBooks().pipe(
      tap((books: arrayFromBookItemTransformedInterface | null) => {
        this.readingNowBooks$.next(books);
        this.miniLoaderReading$.next({ miniLoader: false });
      })
    );
  }
}
