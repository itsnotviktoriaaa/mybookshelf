import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooksSuccess,
} from './';
import { favoritesReducer, initialStateFavorite } from './';
import { mockBookItemWithTotalFav } from 'app/ngrx';
import { FavoritesState } from './';

describe('FavoritesReducer', () => {
  it('should return the initial state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = favoritesReducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual(initialStateFavorite);
  });

  it('should handle loadFavoritesBooks', () => {
    const action = loadFavoritesBooks({ params: { q: 'test', startIndex: 0, maxResults: 40 } });
    const state = favoritesReducer(initialStateFavorite, action);

    expect(state.isLoading).toBe(true);
    expect(state.favoritesBooks).toBeNull();
  });

  it('should handle loadFavoritesBooksSuccess', () => {
    const action = loadFavoritesBooksSuccess({ data: mockBookItemWithTotalFav });
    const state = favoritesReducer(initialStateFavorite, action);

    expect(state.isLoading).toBe(false);
    expect(state.favoritesBooks).toEqual(mockBookItemWithTotalFav);
  });

  it('should handle loadFavoritesBooksFailure', () => {
    const action = loadFavoritesBooksFailure({ error: null });
    const state = favoritesReducer(initialStateFavorite, action);

    expect(state.isLoading).toBe(false);
    expect(state.favoritesBooks).toBeNull();
  });

  it('should handle removeFromFavoritesBooksSuccess when there is only one item', () => {
    const initialStateWithBook: FavoritesState = {
      favoritesBooks: mockBookItemWithTotalFav,
      isLoading: false,
    };
    const action = removeFromFavoritesBooksSuccess({ bookId: 'book1' });
    const state = favoritesReducer(initialStateWithBook, action);

    expect(state.favoritesBooks).toBeNull();
  });

  it('should handle removeFromFavoritesBooksSuccess when there are multiple items', () => {
    const initialStateWithBooks: FavoritesState = {
      favoritesBooks: {
        items: [
          {
            id: '1',
            title: 'Test Book 1',
            thumbnail: 'url1',
            author: ['Author 1'],
            publishedDate: '2020-01-01',
            webReaderLink: 'http://example.com/1',
            pageCount: 100,
            selfLink: 'http://example.com/1',
            categories: ['Category 1'],
            userInfo: '2023-01-01',
            averageRating: 4.5,
          },
          {
            id: '2',
            title: 'Test Book 2',
            thumbnail: 'url2',
            author: ['Author 2'],
            publishedDate: '2021-01-01',
            webReaderLink: 'http://example.com/2',
            pageCount: 200,
            selfLink: 'http://example.com/2',
            categories: ['Category 2'],
            userInfo: '2023-01-02',
            averageRating: 4.0,
          },
        ],
        totalItems: 2,
      },
      isLoading: false,
    };
    const action = removeFromFavoritesBooksSuccess({ bookId: '1' });
    const state = favoritesReducer(initialStateWithBooks, action);

    expect(state.favoritesBooks).not.toBeNull();
    if (state.favoritesBooks) {
      expect(state.favoritesBooks.items.length).toBe(1);
      expect(state.favoritesBooks.items[0].id).toBe('2');
      expect(state.favoritesBooks.totalItems).toBe(1);
    }
  });
});
