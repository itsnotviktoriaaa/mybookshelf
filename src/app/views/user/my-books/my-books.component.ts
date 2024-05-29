import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { IBookItemTransformed } from 'models/';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from 'components/';
import { MiniLoaderComponent } from 'ui/';
import { Observable, of } from 'rxjs';
import { MyBooksFacade } from 'ngr/';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [AsyncPipe, BookComponent, TranslateModule, MiniLoaderComponent],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss',
})
export class MyBooksComponent implements OnInit {
  selfBooks$: Observable<IBookItemTransformed[] | null> = of(null);
  isLoading$: Observable<boolean>;

  constructor(private myBooksFacade: MyBooksFacade) {
    this.isLoading$ = this.myBooksFacade.getLoadingOfMyBooks();
  }

  ngOnInit(): void {
    this.myBooksFacade.loadMyBooks();
    this.selfBooks$ = this.myBooksFacade.getMyBooks();
  }
}
