import { MyBooksFacade } from '../../../ngrx/my-books/my-books.facade';
import { MiniLoaderComponent } from '../../../UI-сomponents';
import { IBookItemTransformed } from '../../../modals/user';
import { TranslateModule } from '@ngx-translate/core';
import { BookComponent } from '../../../components';
import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

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
