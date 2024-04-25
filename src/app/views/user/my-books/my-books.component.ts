import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { BehaviorSubject, map, take } from 'rxjs';
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
  private selfBooksSubject = new BehaviorSubject<BookItemTransformedInterface[] | null>(null);
  selfBooks$ = this.selfBooksSubject.asObservable();

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService
      .getSelfBooks()
      .pipe(
        take(1),
        map((data: DocumentData[]) => {
          return data.map((item: DocumentData) => ({
            id: item['id'],
            title: item['title'],
            author: item['author'],
            description: item['description'],
            webReaderLink: item['webReaderLink'],
            thumbnail: item['thumbnail'],
            publishedDate: item['publishedDate'],
          })) as BookItemTransformedInterface[];
        })
      )
      .subscribe(selfBooks => {
        console.log(selfBooks);
        if (selfBooks && selfBooks.length > 0) {
          this.selfBooksSubject.next(selfBooks);
        } else {
          this.selfBooksSubject.next(null);
        }
      });
  }

  deleteSelfBook(id: string): void {
    const currentBooks = this.selfBooksSubject.value;
    if (currentBooks) {
      const updatedBooks = currentBooks.filter(selfBook => selfBook.id !== id);
      this.selfBooksSubject.next(updatedBooks.length > 0 ? updatedBooks : null);
    } else {
      this.selfBooksSubject.next(null);
    }
  }
}
