import { arrayFromBookItemTransformedInterface } from '../../modals/user';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MiniModalComponent } from '../../UI-сomponents';
import { BookComponent } from '../book/book.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-google-home',
  standalone: true,
  imports: [AsyncPipe, BookComponent, MiniModalComponent],
  templateUrl: './google-home.component.html',
  styleUrl: './google-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleHomeComponent {
  @Input() googleArrayFromHome: arrayFromBookItemTransformedInterface | null = null;
  @Input() miniLoader: { miniLoader: boolean } = { miniLoader: false };
}
