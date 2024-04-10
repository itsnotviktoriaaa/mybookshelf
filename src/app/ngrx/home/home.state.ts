import { arrayFromBookItemTransformedInterface } from '../../types/user';

export interface HomeState {
  recommendedBooks: arrayFromBookItemTransformedInterface | null;
  loading: boolean;
}
export interface HomeNowState {
  readingNowBooks: arrayFromBookItemTransformedInterface | null;
}
