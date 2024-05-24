import { loadSearchLiveBooksFailure, loadSearchLiveBooksSuccess, resetSearchLiveBooks } from './';
import { searchLiveReducer } from './';
import { SearchLiveState } from './';

describe('SearchLive Reducer', () => {
  const initialState: SearchLiveState = {
    searchLive: null,
  };

  it('should set searchLive on loadSearchLiveBooksSuccess', () => {
    const data: string[] = ['book1', 'book2', 'book3'];
    const action = loadSearchLiveBooksSuccess({ data });
    const newState = searchLiveReducer(initialState, action);

    expect(newState.searchLive).toEqual(data);
  });

  it('should set searchLive to null on loadSearchLiveBooksFailure', () => {
    const action = loadSearchLiveBooksFailure({ error: null });
    const newState = searchLiveReducer(initialState, action);

    expect(newState.searchLive).toBeNull();
  });

  it('should reset searchLive on resetSearchLiveBooks', () => {
    const data: null = null;
    const action = resetSearchLiveBooks({ data });
    const newState = searchLiveReducer(initialState, action);

    expect(newState.searchLive).toBeNull();
  });

  it('should return initial state when action is unknown', () => {
    const action = { type: 'Unknown Action' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newState = searchLiveReducer(initialState, action as any);

    expect(newState).toEqual(initialState);
  });
});
