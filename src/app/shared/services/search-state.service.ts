import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private searchTest$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private searchType$: BehaviorSubject<string> = new BehaviorSubject<string>('all');
  constructor() {}

  setSearchString(test: string): void {
    this.searchTest$.next(test);
  }

  getSearchString(): Observable<string> {
    return this.searchTest$.asObservable();
  }

  setSearchType(type: string): void {
    this.searchType$.next(type);
  }

  getSearchType(): Observable<string> {
    return this.searchType$.asObservable();
  }
}
