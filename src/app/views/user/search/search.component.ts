import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SearchBookComponent } from '../../../shared/components';
import { Observable, of } from 'rxjs';
import { SearchInterface } from '../../../types/user';
import { SearchFacade } from '../../../ngrx/search/search.facade';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SvgIconComponent, SearchBookComponent, AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  browseMiniModal: boolean = false;

  headerModalSearchItems: string[] = [
    'Engineering',
    'Medical',
    'Arts & Science',
    'Architecture',
    'Law',
  ];

  searchBooks$: Observable<SearchInterface | null> = of(null);

  constructor(private searchFacade: SearchFacade) {}

  ngOnInit(): void {
    this.searchFacade.loadSearchBooks();
    this.searchBooks$ = this.searchFacade.getSearchBooks();
  }

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
