import { arrayFromBookItemTransformedInterface } from '../../modals/user';

export interface HomeState {
  recommendedBooks: arrayFromBookItemTransformedInterface | null;
  loading: boolean;
}
export interface HomeNowState {
  readingNowBooks: arrayFromBookItemTransformedInterface | null;
}
