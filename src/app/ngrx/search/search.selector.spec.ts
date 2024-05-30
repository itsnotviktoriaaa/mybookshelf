import { selectLoadingOfSearchBooks, selectSearchBooks, selectSearchState } from './';
import { SearchState } from './';

describe('SearchSelectors', () => {
  const mockSearchState: SearchState = {
    search: {
      totalItems: 2,
      items: [],
    },
    isLoading: false,
  };

  it('should select the search state', () => {
    const result = selectSearchState.projector(mockSearchState);
    expect(result).toEqual(mockSearchState);
  });

  it('should select the search books', () => {
    const result = selectSearchBooks.projector(mockSearchState);
    expect(result).toEqual(mockSearchState.search);
  });

  it('should select the loading of search books', () => {
    const result = selectLoadingOfSearchBooks.projector(mockSearchState);
    expect(result).toEqual(mockSearchState.isLoading);
  });
});
