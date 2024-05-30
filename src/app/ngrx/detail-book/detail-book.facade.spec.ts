import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectDetailBook, selectLoadingOfDetailBook } from './';
import { testDetailBookSmallInfo } from 'app/ngrx';
import { TestBed } from '@angular/core/testing';
import { DetailBookFacade } from './';
import { loadDetailBook } from './';

describe('DetailBookFacade', () => {
  let facade: DetailBookFacade;
  let store: MockStore;
  const initialState = {
    detailBook: testDetailBookSmallInfo,
    isLoading: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailBookFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(DetailBookFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadDetailBook action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const idOfBook = '123';
    facade.loadDetailBook(idOfBook);
    expect(dispatchSpy).toHaveBeenCalledWith(loadDetailBook({ idOfBook }));
  });

  it('should return the detail book from the store', done => {
    store.overrideSelector(selectDetailBook, testDetailBookSmallInfo);
    facade.getDetailBook().subscribe(detailBook => {
      expect(detailBook).toEqual(testDetailBookSmallInfo);
      done();
    });
  });

  it('should return loading state from the store', done => {
    store.overrideSelector(selectLoadingOfDetailBook, false);
    facade.getLoadingOfDetailBook().subscribe(isLoading => {
      expect(isLoading).toBe(false);
      done();
    });
  });
});
