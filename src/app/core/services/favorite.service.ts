import {
  IActiveParamsSearch,
  IBook,
  IBookItem,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
} from 'models/';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(
    private http: HttpClient,
    private readonly oAuthService: OAuthService
  ) {}

  getFavorites(params: IActiveParamsSearch): Observable<IBookItemTransformedWithTotal> {
    let queryString: string = `maxResults=${params.maxResults}&startIndex=${params.startIndex}`;

    if (params.q) {
      queryString = `q=${params.q}&` + queryString;
    }

    return this.http
      .get<IBook>(`${environment.googleLibraryApi}0/volumes?${queryString}`, {
        headers: this.authHeader(),
      })
      .pipe(
        map((data: IBook): IBookItemTransformedWithTotal => {
          if (data.totalItems === 0) {
            return {
              items: [],
              totalItems: 0,
            };
          }

          const transformedItems: IBookItemTransformed[] = data.items.map((item: IBookItem) => {
            return {
              id: item.id,
              thumbnail: item.volumeInfo.imageLinks.thumbnail,
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors,
              publishedDate: item.volumeInfo.publishedDate,
              webReaderLink: item.accessInfo.webReaderLink,
              pageCount: item.volumeInfo.pageCount,
              selfLink: item.selfLink,
              categories: item.volumeInfo.categories,
              userInfo: item.userInfo?.updated,
              averageRating: item.volumeInfo.averageRating,
            };
          });

          const uniqueItems: IBookItemTransformed[] = this.filterUniqueBooks(transformedItems);
          return {
            items: uniqueItems,
            totalItems: data.totalItems,
          };
        }),
        catchError(error => throwError(() => error))
      );
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json',
    });
  }

  filterUniqueBooks(books: IBookItemTransformed[]): IBookItemTransformed[] {
    return books.filter((book, index, self) => index === self.findIndex(b => b.id === book.id));
  }
}
