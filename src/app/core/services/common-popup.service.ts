import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonPopupService {
  isDeleteOwnBook$ = new BehaviorSubject<boolean>(false);

  setIsDeleteOwnBookOrNot(param: boolean): void {
    this.isDeleteOwnBook$.next(param);
  }

  getDeleteOwnBookOrNot(): Observable<boolean> {
    return this.isDeleteOwnBook$.asObservable();
  }
}
