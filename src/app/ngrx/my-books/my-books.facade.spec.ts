import { selectLoadingOfMyBooks, selectMyBooks } from './my-books.selector';
import { loadMyBooks, removeFromMyBooks } from './my-books.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IBookItemTransformed } from '../../modals/user';
import { MyBooksFacade } from './my-books.facade';
import { TestBed } from '@angular/core/testing';

describe('MyBooksFacade', () => {
  let facade: MyBooksFacade;
  let store: MockStore;
  const initialState = { myBooks: { books: null, loading: false } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyBooksFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(MyBooksFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadMyBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    facade.loadMyBooks();
    expect(dispatchSpy).toHaveBeenCalledWith(loadMyBooks());
  });

  it('should dispatch removeFromMyBooks action with provided parameters', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const id = '1';
    const webReaderLink = 'webReaderLink';
    const thumbnail = 'thumbnail';
    facade.loadRemoveMyBook(id, webReaderLink, thumbnail);
    expect(dispatchSpy).toHaveBeenCalledWith(removeFromMyBooks({ id, webReaderLink, thumbnail }));
  });

  it('should return selected my books', () => {
    const expectedBooks: IBookItemTransformed[] = [
      {
        id: '1',
        title: 'Book 1',
        author: ['Author 1'],
        webReaderLink: '',
        thumbnail: '',
        publishedDate: '',
      },
    ];
    store.overrideSelector(selectMyBooks, expectedBooks);
    facade.getMyBooks().subscribe(books => {
      expect(books).toEqual(expectedBooks);
    });
  });

  it('should return loading status of my books', () => {
    const expectedLoading = true;
    store.overrideSelector(selectLoadingOfMyBooks, expectedLoading);
    facade.getLoadingOfMyBooks().subscribe(loading => {
      expect(loading).toEqual(expectedLoading);
    });
  });
});
