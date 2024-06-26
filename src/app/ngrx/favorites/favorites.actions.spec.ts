import {
  loadFavoritesBooks,
  loadFavoritesBooksFailure,
  loadFavoritesBooksSuccess,
  removeFromFavoritesBooks,
  removeFromFavoritesBooksFailure,
  removeFromFavoritesBooksSuccess,
} from './';
import { mockBookItemWithTotalHome } from 'app/ngrx';
import { IActiveParamsSearch } from 'app/models';

describe('Favorites Actions', () => {
  it('should create loadFavoritesBooks action', () => {
    const params: IActiveParamsSearch = { q: 'test', startIndex: 0, maxResults: 40 };
    const action = loadFavoritesBooks({ params });
    expect(action.type).toBe('[Favorites] Load Favorites Books');
    expect(action.params).toEqual(params);
  });

  it('should create loadFavoritesBooksSuccess action', () => {
    const action = loadFavoritesBooksSuccess({ data: mockBookItemWithTotalHome });
    expect(action.type).toBe('[Favorites] Load Favorites Books Success');
    expect(action.data).toEqual(mockBookItemWithTotalHome);
  });

  it('should create loadFavoritesBooksFailure action', () => {
    const action = loadFavoritesBooksFailure({ error: null });
    expect(action.type).toBe('[Favorites] Load Favorites Books Failure');
    expect(action.error).toBeNull();
  });

  it('should create removeFromFavoritesBooks action', () => {
    const bookId = '1';
    const action = removeFromFavoritesBooks({ bookId });
    expect(action.type).toBe('[Favorites] Remove Favorites Book');
    expect(action.bookId).toBe(bookId);
  });

  it('should create removeFromFavoritesBooksSuccess action', () => {
    const bookId = '1';
    const action = removeFromFavoritesBooksSuccess({ bookId });
    expect(action.type).toBe('[Favorites] Remove Favorites Book Success');
    expect(action.bookId).toBe(bookId);
  });

  it('should create removeFromFavoritesBooksFailure action', () => {
    const action = removeFromFavoritesBooksFailure({ error: null });
    expect(action.type).toBe('[Favorites] Remove Favorites Book Failure');
    expect(action.error).toBeNull();
  });
});
