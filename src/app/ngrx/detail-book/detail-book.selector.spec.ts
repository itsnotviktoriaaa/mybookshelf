import { selectDetailBook, selectLoadingOfDetailBook } from './detail-book.selector';
import { DetailBookState } from './detail-book.state';

describe('Detail Book Selectors', () => {
  const mockDetailBookState: DetailBookState = {
    detailBook: {
      id: '123',
      title: 'Test Book',
      authors: ['Author One', 'Author Two'],
      publishedDate: '2021-01-01',
      publisher: 'Test Publisher',
      averageRating: 4.5,
      accessInfo: ['EPUB'],
      thumbnail: 'http://example.com/thumbnail.jpg',
      description: 'This is a test book.',
      webReaderLink: 'http://example.com/webReaderLink',
    },
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
