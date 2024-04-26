import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
