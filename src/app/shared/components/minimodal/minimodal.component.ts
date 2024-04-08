import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-minimodal',
  standalone: true,
  imports: [],
  templateUrl: './minimodal.component.html',
})
export class MiniModalComponent {
  @Input() miniLoader: boolean = true;
  @Input() miniLoader1: boolean = false;
  constructor() {}
}
