import { selectDetailBook, selectLoadingOfDetailBook } from './detail-book.selector';
import { IDetailBookSmallInfo } from '../../models/personal-library';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DetailBookFacade } from './detail-book.facade';
import { loadDetailBook } from './detail-book.actions';
import { TestBed } from '@angular/core/testing';

describe('DetailBookFacade', () => {
  let facade: DetailBookFacade;
  let store: MockStore;
  const mockDetailBook: IDetailBookSmallInfo = {
    id: '123',
    title: 'Test Book',
    authors: ['Author One', 'Author Two'],
    publishedDate: '2021-01-01',
    publisher: 'Test Publisher',
    averageRating: 4.5,
    accessInfo: ['EPUB'],
    thumbnail: 'http://example.com/thumbnail.jpg',
    description: 'This is a test book.',
    webReaderLink: 'http://example.com/webReaderLink',
  };
  const initialState = {
    detailBook: mockDetailBook,
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
    store.overrideSelector(selectDetailBook, mockDetailBook);
    facade.getDetailBook().subscribe(detailBook => {
      expect(detailBook).toEqual(mockDetailBook);
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
