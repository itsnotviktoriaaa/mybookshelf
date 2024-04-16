import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SearchDetailInterface } from '../../../types/user';
import { TransformDateBookPipe } from '../../pipes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-book',
  standalone: true,
  imports: [SvgIconComponent, TransformDateBookPipe],
  templateUrl: './search-book.component.html',
  styleUrl: './search-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent {
  @Input() searchBook: SearchDetailInterface | null = null;

  constructor(private router: Router) {}

  openDetailPage(): void {
    this.router.navigate(['/home/book/' + this.searchBook?.id]).then(() => {});
  }
}
