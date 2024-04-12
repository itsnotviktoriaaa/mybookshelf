import { Component, HostListener } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  headerModalSearchItems: string[] = [
    'Engineering',
    'Medical',
    'Arts & Science',
    'Architecture',
    'Law',
  ];
  browseMiniModal: boolean = false;

  openOrCloseMiniModal(): void {
    this.browseMiniModal = !this.browseMiniModal;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.browseMiniModal && !(event.target as Element).closest('.header-search-info')) {
      this.browseMiniModal = false;
    }
  }
}
