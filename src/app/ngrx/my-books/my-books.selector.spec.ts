import { selectLoadingOfMyBooks, selectMyBooks, selectMyBooksState } from './';
import { mockMyBooksState } from 'app/ngrx';

describe('MyBooks Selectors', () => {
  it('should select the myBooks state', () => {
    const selectedState = selectMyBooksState.projector(mockMyBooksState);
    expect(selectedState).toEqual(mockMyBooksState);
  });

  it('should select the myBooks', () => {
    const selectedBooks = selectMyBooks.projector(mockMyBooksState);
    expect(selectedBooks).toEqual(mockMyBooksState.myBooks);
  });

  it('should select the loading state of myBooks', () => {
    const isLoading = selectLoadingOfMyBooks.projector(mockMyBooksState);
    expect(isLoading).toEqual(mockMyBooksState.isLoading);
  });
});
