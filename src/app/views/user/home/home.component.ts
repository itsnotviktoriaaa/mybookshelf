import { SubscribeDecorator } from '../../../decorators/subscribe-decorator';
import { arrayFromBookItemTransformedInterface } from '../../../modals/user';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HomeFacade } from '../../../ngrx/home/home.facade';
import { MiniModalComponent } from '../../../UI-сomponents';
import { UserInfoFromGoogle } from '../../../modals/auth';
import { GoogleHomeComponent } from '../../../components';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BookComponent } from '../../../components';
import { GoogleApiService } from '../../../core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

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

  miniLoader$ = new BehaviorSubject<{ miniLoader: boolean }>({ miniLoader: true });

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
      })
    );
  }
}
