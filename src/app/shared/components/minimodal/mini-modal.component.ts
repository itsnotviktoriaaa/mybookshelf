import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-modal',
  standalone: true,
  templateUrl: './mini-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniModalComponent {
  @Input() miniLoader: boolean = true;
  @Input() miniLoader1: boolean = false;
  constructor() {}
}
