import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BookItemTransformedInterface } from 'types/';
import { Router } from '@angular/router';
import { ReduceLetterPipe } from '../../';
import { TransformDateBookPipe } from '../../';
import { NgStyle } from '@angular/common';
import { TransformFavoriteDatePipe } from '../../';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReduceLetterPipe, TransformDateBookPipe, NgStyle, TransformFavoriteDatePipe],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() book!: BookItemTransformedInterface;
  @Input() bigInfo: boolean = false;

  constructor(private router: Router) {}

  openDetailBook(sizeBook: 'small-book' | 'big-book') {
    if (sizeBook === 'small-book' && !this.bigInfo) {
      this.router.navigate(['home/book/', this.book.id]).then(() => {});
    } else if (sizeBook === 'big-book') {
      this.router.navigate(['home/book/', this.book.id]).then(() => {});
    }
  }
  openGoogleInfo() {
    window.open(this.book.webReaderLink, '_blank');
  }
}
