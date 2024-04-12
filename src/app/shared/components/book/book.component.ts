import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BookItemTransformedInterface } from '../../../types/user';
import { Router } from '@angular/router';
import { ReduceLetterPipe } from '../../pipes';
import { TransformDateBookPipe } from '../../pipes';
import { NgClass, NgStyle } from '@angular/common';
import { TransformFavoriteDatePipe } from '../../pipes';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReduceLetterPipe, TransformDateBookPipe, NgStyle, TransformFavoriteDatePipe, NgClass],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() book: BookItemTransformedInterface | null = null;
  @Input() bigInfo: boolean = false;

  constructor(private router: Router) {}

  openDetailBook(sizeBook: 'small-book' | 'big-book'): void {
    if (sizeBook === 'small-book' && !this.bigInfo) {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    } else if (sizeBook === 'big-book') {
      this.router.navigate(['home/book/', this.book?.id]).then(() => {});
    }
  }
  openGoogleInfo(): void {
    window.open(this.book?.webReaderLink, '_blank');
  }
}
