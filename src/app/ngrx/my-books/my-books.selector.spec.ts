import { selectLoadingOfMyBooks, selectMyBooks, selectMyBooksState } from './my-books.selector';
import { MyBooksState } from './my-books.state';

describe('MyBooks Selectors', () => {
  const mockMyBooksState: MyBooksState = {
    myBooks: [
      {
        id: '1',
        thumbnail: 'https://example.com/thumbnail1.jpg',
        title: 'Book 1',
        author: ['Author 1'],
        publishedDate: '2022-05-19',
        webReaderLink: 'https://example.com/reader/book1',
      },
      {
        id: '2',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        title: 'Book 2',
        author: ['Author 2'],
        publishedDate: '2022-05-20',
        webReaderLink: 'https://example.com/reader/book2',
      },
    ],
    isLoading: false,
  };

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
