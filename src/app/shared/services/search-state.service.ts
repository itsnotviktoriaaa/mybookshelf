import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private searchCategory$: BehaviorSubject<string> = new BehaviorSubject<string>('Browse');
  private searchType$: BehaviorSubject<string> = new BehaviorSubject<string>('All');
  constructor() {}

  setSearchCategory(category: string): void {
    this.searchCategory$.next(category);
  }

  getSearchCategory(): Observable<string> {
    return this.searchCategory$.asObservable();
  }

  setHeaderModalItem(type: string): void {
    this.searchType$.next(type);
  }

  getHeaderModalItem(): Observable<string> {
    return this.searchType$.asObservable();
  }
}
