import {
  loadDetailBook,
  loadDetailBookFailure,
  loadDetailBookSuccess,
} from './detail-book.actions';
import { testDetailBook, testDetailBookSmallInfo } from 'app/ngrx';
import { provideMockActions } from '@ngrx/effects/testing';
import { DetailBookEffects } from './detail-book.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from 'app/core';

describe('DetailBookEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: DetailBookEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getDetailBook']);

    TestBed.configureTestingModule({
      providers: [
        DetailBookEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(DetailBookEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadDetailBookSuccess on success', done => {
    const action = loadDetailBook({ idOfBook: '123' });
    const completion = loadDetailBookSuccess({ data: testDetailBookSmallInfo });

    actions$ = of(action);
    googleApiService.getDetailBook.and.returnValue(of(testDetailBook));

    effects.loadDetailBook$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });

  it('should return loadDetailBookFailure on error', done => {
    const action = loadDetailBook({ idOfBook: '123' });
    const error = new Error('error');
    const completion = loadDetailBookFailure({ error: null });

    actions$ = of(action);
    googleApiService.getDetailBook.and.returnValue(throwError(() => error));

    effects.loadDetailBook$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });
});
