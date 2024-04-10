import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-minimodal',
  standalone: true,
  templateUrl: './minimodal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniModalComponent {
  @Input() miniLoader: boolean = true;
  @Input() miniLoader1: boolean = false;
  constructor() {}
}
