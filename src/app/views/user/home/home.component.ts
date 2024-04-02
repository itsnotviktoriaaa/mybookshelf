import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookComponent } from '../../../shared';
import { GoogleApiService, UserInfoFromGoogle } from '../../../core/auth/google-api.service';
import { map, tap } from 'rxjs';
import { arrayFromBookItemTransformedInterface, BookInterface, BookItemInterface, BookItemTransformedInterface } from '../../../../types/user/book.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  recommendedBooks?: arrayFromBookItemTransformedInterface;
  readingNowBooks?: arrayFromBookItemTransformedInterface;
  constructor(
    private googleApi: GoogleApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.googleApi.userProfileSubject.subscribe((info: UserInfoFromGoogle | null) => {
      if (info) {
        console.log('8686868');
        this.getRecommended();
        this.getReadingNow();
      }
    });

    // this.getReadingNow();
  }

  getBooks() {
    this.googleApi.getBooks().subscribe(data => {
      console.log(data);
    });
  }

  getFavorites() {
    this.googleApi.getFavorites().subscribe(data => {
      console.log(data);
    });
  }

  getReadingNow() {
    this.googleApi
      .getReadingNow()
      .pipe(
        map((data: BookInterface): arrayFromBookItemTransformedInterface => {
          const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
            return {
              selfLink: item.selfLink,
              thumbnail: item.volumeInfo.imageLinks.thumbnail,
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors,
              publishedDate: item.volumeInfo.publishedDate,
              fullPrice: item.saleInfo.listPrice?.amount + ' ' + item.saleInfo.listPrice?.currencyCode,
              categories: item.volumeInfo.categories,
              webReaderLink: item.accessInfo.webReaderLink,
              pageCount: item.volumeInfo.pageCount,
              contentVersion: item.volumeInfo.contentVersion,
              publisher: item.volumeInfo.publisher,
            };
          });

          return {
            items: transformedItems,
            totalItems: data.totalItems,
          };
        }),
        tap((data: arrayFromBookItemTransformedInterface) => {
          this.readingNowBooks = data;
          this.cdr.detectChanges();
          console.log(data);
        })
      )
      .subscribe(() => {});
  }

  getRecommended() {
    this.googleApi
      .getRecommended()
      .pipe(
        map((data: BookInterface): arrayFromBookItemTransformedInterface => {
          const transformedItems: BookItemTransformedInterface[] = data.items.map((item: BookItemInterface): BookItemTransformedInterface => {
            return {
              selfLink: item.selfLink,
              thumbnail: item.volumeInfo.imageLinks.thumbnail,
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors,
              publishedDate: item.volumeInfo.publishedDate,
              fullPrice: item.saleInfo.listPrice?.amount + ' ' + item.saleInfo.listPrice?.currencyCode,
              categories: item.volumeInfo.categories,
              webReaderLink: item.accessInfo.webReaderLink,
              pageCount: item.volumeInfo.pageCount,
              contentVersion: item.volumeInfo.contentVersion,
              publisher: item.volumeInfo.publisher,
            };
          });

          return {
            items: transformedItems,
            totalItems: data.totalItems,
          };
        }),
        tap((data: arrayFromBookItemTransformedInterface) => {
          this.recommendedBooks = data;
          this.cdr.detectChanges();
          console.log(data);
        })
      )
      .subscribe(() => {});
  }

  setFavoriteBook() {
    this.googleApi.setFavoriteBook().subscribe(data => {
      console.log(data);
    });
  }
}
