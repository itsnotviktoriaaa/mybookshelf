import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mini-modal',
  standalone: true,
  templateUrl: './mini-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniModalComponent {}
