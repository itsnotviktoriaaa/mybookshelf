import { selectSearchLiveBooks } from './';
import { SearchLiveState } from './';

describe('SearchLive Selectors', () => {
  const initialState: SearchLiveState = {
    searchLive: ['book1', 'book2', 'book3'],
  };

  it('should select searchLive books', () => {
    const selectedBooks = selectSearchLiveBooks.projector(initialState);
    expect(selectedBooks).toEqual(['book1', 'book2', 'book3']);
  });
});
