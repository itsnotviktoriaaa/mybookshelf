import { loadAuthor, loadAuthorFailure, loadAuthorSuccess } from './author.actions';

describe('Author Actions', () => {
  it('should create loadAuthor action', () => {
    const action = loadAuthor({ author: 'Test Author', idOfBook: '123' });
    expect(action.type).toBe('[Author] Load Detail Author');
    expect(action.author).toBe('Test Author');
    expect(action.idOfBook).toBe('123');
  });

  it('should create loadAuthorSuccess action', () => {
    const payload = { totalItems: 1, items: [{ id: '1', thumbnail: 'url', title: 'title' }] };
    const action = loadAuthorSuccess({ data: payload });
    expect(action.type).toBe('[Author] Load Detail Author Success');
    expect(action.data).toEqual(payload);
  });

  it('should create loadAuthorFailure action', () => {
    const action = loadAuthorFailure({ error: null });
    expect(action.type).toBe('[Author] Load Detail Author Failure');
    expect(action.error).toBeNull();
  });
});
