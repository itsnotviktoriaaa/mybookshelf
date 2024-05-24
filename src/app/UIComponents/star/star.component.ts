import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [NgClass],
  templateUrl: './star.component.html',
  styleUrl: './star.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarComponent {
  @Input() rating: number = 0;
}
