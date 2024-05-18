import {
  loadSearchLiveBooks,
  loadSearchLiveBooksFailure,
  loadSearchLiveBooksSuccess,
  resetSearchLiveBooks,
} from './search-live.actions';

describe('Search Live Actions', () => {
  it('should create loadSearchLiveBooks action', () => {
    const action = loadSearchLiveBooks({ textFromInput: 'test', typeFromInput: 'book' });
    expect(action.type).toBe('[Search Live] Load Search Live Books');
    expect(action.textFromInput).toBe('test');
    expect(action.typeFromInput).toBe('book');
  });

  it('should create loadSearchLiveBooksSuccess action', () => {
    const payload = ['book1', 'book2'];
    const action = loadSearchLiveBooksSuccess({ data: payload });
    expect(action.type).toBe('[Search Live] Load Search Live Books Success');
    expect(action.data).toEqual(payload);
  });

  it('should create loadSearchLiveBooksFailure action', () => {
    const action = loadSearchLiveBooksFailure({ error: null });
    expect(action.type).toBe('[Search Live] Load Search Live Books Failure');
    expect(action.error).toBeNull();
  });

  it('should create resetSearchLiveBooks action', () => {
    const action = resetSearchLiveBooks({ data: null });
    expect(action.type).toBe('[Search Live] Reset Search Live Books');
    expect(action.data).toBeNull();
  });
});
