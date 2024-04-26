import { MiniModalComponent } from '../../UI-сomponents';
import { arrayFromBookItemTransformedInterface } from '../../modals/user';
import { BookComponent } from '../book/book.component';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  @Input() miniLoader: { miniLoader: boolean } = { miniLoader: true };
}
