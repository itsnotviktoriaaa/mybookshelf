import { selectAuthor, selectAuthorState } from './author.selector';
import { AuthorState } from './author.state';
import { ISearchSmall } from 'app/models';

describe('AuthorSelectors', () => {
  const authorData: ISearchSmall = {
    totalItems: 1,
    items: [{ id: '1', thumbnail: 'url', title: 'title' }],
  };

  const state: AuthorState = {
    author: authorData,
  };

  it('should select the author state', () => {
    const result = selectAuthorState.projector(state);
    expect(result).toEqual(state);
  });

  it('should select the author', () => {
    const result = selectAuthor.projector(state);
    expect(result).toEqual(authorData);
  });
});
