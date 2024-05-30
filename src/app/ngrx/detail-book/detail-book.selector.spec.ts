import { selectDetailBook, selectLoadingOfDetailBook } from './';
import { testDetailBookSmallInfo } from 'app/ngrx';
import { DetailBookState } from './';

describe('Detail Book Selectors', () => {
  const mockDetailBookState: DetailBookState = {
    detailBook: testDetailBookSmallInfo,
    isLoading: true,
  };

  it('should select the detailBook from the state', () => {
    const selectedDetailBook = selectDetailBook.projector(mockDetailBookState);
    expect(selectedDetailBook).toEqual(mockDetailBookState.detailBook);
  });

  it('should select the isLoading from the state', () => {
    const selectedLoadingOfDetailBook = selectLoadingOfDetailBook.projector(mockDetailBookState);
    expect(selectedLoadingOfDetailBook).toEqual(mockDetailBookState.isLoading);
  });
});
