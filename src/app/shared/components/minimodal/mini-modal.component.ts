import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-modal',
  standalone: true,
  templateUrl: './mini-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniModalComponent {
  @Input() miniLoader: { miniLoader: boolean } = { miniLoader: false };
  @Input() miniLoaderReading: { miniLoader: boolean } = { miniLoader: false };
  constructor() {}

  // ngOnChanges() {
  //   console.log(this.miniLoader);
  // }
}
