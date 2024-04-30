import { DestroyDirective } from '../../../core/directives/destroy.directive';
import { SubscribeDecorator } from '../../../decorators/subscribe-decorator';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IBookItemTransformedWithTotal } from '../../../modals/user';
import { HomeFacade } from '../../../ngrx/home/home.facade';
import { MiniModalComponent } from '../../../UI-сomponents';
import { IUserInfoFromGoogle } from '../../../modals/auth';
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
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  recommendedBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);

  readingNowBooks$ = new BehaviorSubject<IBookItemTransformedWithTotal | null>(null);

  miniLoader$ = new BehaviorSubject<{ miniLoader: boolean }>({ miniLoader: true });

  // private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private googleApi: GoogleApiService,
    private homeFacade: HomeFacade
  ) {}

  ngOnInit(): void {
    this.googleApi.userProfileSubject.subscribe((user: IUserInfoFromGoogle | null) => {
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
      tap((book: IBookItemTransformedWithTotal | null) => {
        console.log(book);
        this.recommendedBooks$.next(book);
        this.miniLoader$.next({ miniLoader: false });
      })
    );
  }

  @SubscribeDecorator()
  getReadingNowBooksObservable(): Observable<IBookItemTransformedWithTotal | null> {
    return this.homeFacade.getReadingNowBooks().pipe(
      tap((books: IBookItemTransformedWithTotal | null) => {
        this.readingNowBooks$.next(books);
      })
    );
  }
}
