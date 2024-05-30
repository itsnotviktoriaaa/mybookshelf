import { selectFavoritesBooks, selectLoadingOfFavoritesBooks } from '.';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { loadFavoritesBooks, removeFromFavoritesBooks } from './';
import { mockBookItemWithTotalFav } from 'app/ngrx';
import { IActiveParamsSearch } from 'app/models';
import { TestBed } from '@angular/core/testing';
import { FavoritesFacade } from './';

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
    store.overrideSelector(selectFavoritesBooks, mockBookItemWithTotalFav);
    facade.getFavoritesBooks().subscribe(data => {
      expect(data).toEqual(mockBookItemWithTotalFav);
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
