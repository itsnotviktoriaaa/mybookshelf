import { arrayFromBookItemTransformedInterface } from '../../../types/user/book.interface';

export interface HomeState {
  recommendedBooks: arrayFromBookItemTransformedInterface | null;
}
export interface HomeNowState {
  readingNowBooks: arrayFromBookItemTransformedInterface | null;
}
