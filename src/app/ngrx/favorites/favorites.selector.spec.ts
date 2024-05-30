import {
  selectFavoritesBooks,
  selectFavoritesState,
  selectLoadingOfFavoritesBooks,
} from './favorites.selector';
import { IBookItemTransformedWithTotal } from 'app/models';
import { FavoritesState } from './favorites.state';

describe('FavoritesSelectors', () => {
  const favoritesData: IBookItemTransformedWithTotal = {
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
  };

  const state: FavoritesState = {
    favoritesBooks: favoritesData,
    isLoading: true,
  };

  it('should select the favorites state', () => {
    const result = selectFavoritesState.projector(state);
    expect(result).toEqual(state);
  });

  it('should select the favorites books', () => {
    const result = selectFavoritesBooks.projector(state);
    expect(result).toEqual(favoritesData);
  });

  it('should select the loading state of favorites books', () => {
    const result = selectLoadingOfFavoritesBooks.projector(state);
    expect(result).toEqual(true);
  });
});
