import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mini-loader',
  standalone: true,
  templateUrl: './mini-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniLoaderComponent {}
