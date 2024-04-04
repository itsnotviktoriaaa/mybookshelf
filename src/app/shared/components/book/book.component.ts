import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BookItemTransformedInterface } from '../../../../types/user/book.interface';
import { Router } from '@angular/router';
import { ReduceLetterPipe } from '../../pipes/reduce-letter.pipe';
import { TransformDateBookPipe } from '../../pipes/transform-date-book.pipe';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReduceLetterPipe, TransformDateBookPipe],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() book!: BookItemTransformedInterface;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['/book/' + this.book.selfLink]).then(() => {});
  }
}
