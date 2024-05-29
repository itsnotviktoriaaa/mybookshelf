import { IActiveParamsSearch, IBookItemTransformedWithTotal } from '../../models/personal-library';
import { selectFavoritesBooks, selectLoadingOfFavoritesBooks } from './favorites.selector';
import { loadFavoritesBooks, removeFromFavoritesBooks } from './favorites.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FavoritesFacade } from './favorites.facade';
import { TestBed } from '@angular/core/testing';

describe('FavoritesFacade', () => {
  let facade: FavoritesFacade;
  let store: MockStore;
  const initialState = { favorites: { books: null, loading: false } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritesFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(FavoritesFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadFavoritesBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const params: IActiveParamsSearch = { q: 'test', startIndex: 0, maxResults: 40 };

    facade.loadFavoritesBooks(params);
    expect(dispatchSpy).toHaveBeenCalledWith(loadFavoritesBooks({ params }));
  });

  it('should return selected favorites books', () => {
    const expectedData: IBookItemTransformedWithTotal = {
      totalItems: 1,
      items: [
        {
          id: '1',
          thumbnail: 'url',
          title: 'title',
          author: ['Author'],
          publishedDate: '2020-01-01',
          webReaderLink: 'http://example.com',
          pageCount: 100,
          selfLink: 'http://example.com',
          categories: ['Category'],
          userInfo: '2023-01-01',
          averageRating: 4.5,
        },
      ],
    };
    store.overrideSelector(selectFavoritesBooks, expectedData);

    facade.getFavoritesBooks().subscribe(data => {
      expect(data).toEqual(expectedData);
    });
  });

  it('should return loading state of favorites books', () => {
    const expectedLoading = true;
    store.overrideSelector(selectLoadingOfFavoritesBooks, expectedLoading);

    facade.getLoadingOfFavoritesBooks().subscribe(loading => {
      expect(loading).toBe(expectedLoading);
    });
  });

  it('should dispatch removeFromFavoritesBooks action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const bookId = '1';

    facade.loadRemoveFavoritesBooks(bookId);
    expect(dispatchSpy).toHaveBeenCalledWith(removeFromFavoritesBooks({ bookId }));
  });
});
