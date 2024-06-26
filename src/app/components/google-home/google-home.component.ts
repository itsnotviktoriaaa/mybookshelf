import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IBookItemTransformedWithTotal } from 'models/';
import { AsyncPipe } from '@angular/common';
import { BookComponent } from 'components/';
import { MiniLoaderComponent } from 'ui/';

@Component({
  selector: 'app-google-home',
  standalone: true,
  imports: [AsyncPipe, BookComponent, MiniLoaderComponent],
  templateUrl: './google-home.component.html',
  styleUrl: './google-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleHomeComponent {
  googleArrayFromHome = input<IBookItemTransformedWithTotal>();
}
