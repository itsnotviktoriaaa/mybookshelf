import {
  loadDetailBook,
  loadDetailBookSuccess,
  loadDetailBookFailure,
} from './detail-book.actions';
import { IDetailBookSmallInfo } from '../../models/user';

describe('Author Actions', () => {
  it('should create the loadDetailBook action', () => {
    const idOfBook = '123';
    const action = loadDetailBook({ idOfBook });

    expect(action.type).toEqual('[Detail Book] Load Detail Book');
    expect(action.idOfBook).toEqual(idOfBook);
  });

  it('should create the loadDetailBookSuccess action', () => {
    const mockData: IDetailBookSmallInfo = {
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
    };
    const action = loadDetailBookSuccess({ data: mockData });

    expect(action.type).toEqual('[Detail Book] Load Detail Books Success');
    expect(action.data).toEqual(mockData);
  });

  it('should create the loadDetailBookFailure action', () => {
    const error = null;
    const action = loadDetailBookFailure({ error });

    expect(action.type).toEqual('[Detail Book] Load Detail Books Failure');
    expect(action.error).toEqual(null);
  });
});
