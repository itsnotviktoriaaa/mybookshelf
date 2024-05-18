import { selectSearchLiveBooks } from './search-live.selector';
import { SearchLiveState } from './search-live.state';

describe('SearchLive Selectors', () => {
  const initialState: SearchLiveState = {
    searchLive: ['book1', 'book2', 'book3'],
  };

  it('should select searchLive books', () => {
    const selectedBooks = selectSearchLiveBooks.projector(initialState);
    expect(selectedBooks).toEqual(['book1', 'book2', 'book3']);
  });
});
