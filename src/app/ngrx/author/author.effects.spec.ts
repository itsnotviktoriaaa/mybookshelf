import { loadAuthor, loadAuthorFailure, loadAuthorSuccess } from './';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthorEffects, infoDetail } from 'app/ngrx';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { GoogleApiService } from 'app/core';

describe('AuthorEffects', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: AuthorEffects;
  let googleApiService: jasmine.SpyObj<GoogleApiService>;

  beforeEach(() => {
    const googleApiSpy = jasmine.createSpyObj('GoogleApiService', ['getAuthorDetail']);

    TestBed.configureTestingModule({
      providers: [
        AuthorEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: GoogleApiService, useValue: googleApiSpy },
      ],
    });

    effects = TestBed.inject(AuthorEffects);
    googleApiService = TestBed.inject(GoogleApiService) as jasmine.SpyObj<GoogleApiService>;
  });

  it('should return loadAuthorSuccess on success', done => {
    const action = loadAuthor({ author: 'Test Author', idOfBook: '123' });
    const completion = loadAuthorSuccess({
      data: {
        totalItems: 2,
        items: [
          { id: '1', thumbnail: 'thumbnail1', title: 'Book Title 1' },
          { id: '2', thumbnail: 'thumbnail2', title: 'Book Title 2' },
        ],
      },
    });

    actions$ = of(action);
    googleApiService.getAuthorDetail.and.returnValue(of(infoDetail));

    effects.loadAuthor$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });

  it('should return loadAuthorFailure on error', done => {
    const action = loadAuthor({ author: 'Test Author', idOfBook: '123' });
    const error = new Error('error');
    const completion = loadAuthorFailure({ error: null });

    actions$ = of(action);
    googleApiService.getAuthorDetail.and.returnValue(throwError(() => error));

    effects.loadAuthor$.subscribe(result => {
      expect(result).toEqual(completion);
      done();
    });
  });
});
