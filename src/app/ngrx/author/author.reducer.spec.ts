import { loadAuthorFailure, loadAuthorSuccess } from './';
import { authorReducer, initialStateAuthor } from './';
import { ISearchSmall } from 'app/models';

describe('AuthorReducer', () => {
  it('should return the initial state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = authorReducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual(initialStateAuthor);
  });

  it('should handle loadAuthorSuccess', () => {
    const authorData: ISearchSmall = {
      totalItems: 1,
      items: [{ id: '1', thumbnail: 'url', title: 'title' }],
    };
    const action = loadAuthorSuccess({ data: authorData });
    const state = authorReducer(initialStateAuthor, action);

    expect(state.author).toEqual(authorData);
  });

  it('should handle loadAuthorFailure', () => {
    const action = loadAuthorFailure({ error: null });
    const state = authorReducer(initialStateAuthor, action);

    expect(state.author).toBeNull();
  });
});
