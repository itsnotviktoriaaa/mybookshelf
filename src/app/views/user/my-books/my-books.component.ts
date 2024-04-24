import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { map, Observable, of, take, tap } from 'rxjs';
import { DocumentData } from '@firebase/firestore';
import { AsyncPipe } from '@angular/common';
import { SelfBookInterface } from '../../../types/user/self-book.interface';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss',
})
export class MyBooksComponent implements OnInit {
  selfBooks$: Observable<SelfBookInterface[] | null> = of(null);

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
            title: item['title'],
            author: item['author'],
            description: item['description'],
            pdfUrl: item['pdfUrl'],
            photoUrl: item['photoUrl'],
            date: item['date'],
          } as SelfBookInterface;
        });
      })
    );
  }
}
