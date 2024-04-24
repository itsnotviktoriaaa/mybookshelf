import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { map, Observable, of, take, tap } from 'rxjs';
import { DocumentData } from '@firebase/firestore';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from '../../../shared/components';
import { BookItemTransformedInterface } from '../../../types/user';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [AsyncPipe, BookComponent],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss',
})
export class MyBooksComponent implements OnInit {
  selfBooks$: Observable<BookItemTransformedInterface[] | null> = of(null);

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.selfBooks$ = this.databaseService.getSelfBooks().pipe(
      take(1),
      tap((data): void => {
        console.log(data);
      }),
      map((data: DocumentData[]) => {
        return data.map((item: DocumentData) => {
          return {
            id: '',
            title: item['title'],
            author: item['author'],
            description: item['description'],
            webReaderLink: item['webReaderLink'],
            thumbnail: item['thumbnail'],
            publishedDate: item['publishedDate'],
          } as BookItemTransformedInterface;
        });
      })
    );
  }
}
