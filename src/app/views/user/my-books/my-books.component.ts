import { IBookItemTransformed } from '../../../modals/user';
import { BookComponent } from '../../../components';
import { DocumentData } from '@firebase/firestore';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [AsyncPipe, BookComponent],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss',
})
export class MyBooksComponent implements OnInit {
  private selfBooksSubject = new BehaviorSubject<IBookItemTransformed[] | null>(null);
  selfBooks$ = this.selfBooksSubject.asObservable();
  // examplePdfUrl = 'https://firebasestorage.googleapis.com/v0/b/mybookshelff-c1a0f.appspot.com/o/EXCj50C0ruWGrJumrcfbjknFxik2%2Fpdfs%2F2rrspocd0fo_RETRO%2019.04.2024.pdf?alt=media&token=b529b2b2-5d77-4779-a4c8-122e34cda9b5';

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService
      .getSelfBooks()
      .pipe(
        map((data: DocumentData[]) => {
          return data.map((item: DocumentData) => ({
            id: item['id'],
            title: item['title'],
            author: item['author'],
            description: item['description'],
            webReaderLink: item['webReaderLink'],
            thumbnail: item['thumbnail'],
            publishedDate: item['publishedDate'],
          })) as IBookItemTransformed[];
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
