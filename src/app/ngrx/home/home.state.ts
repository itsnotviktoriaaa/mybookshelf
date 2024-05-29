import { IBookItemTransformedWithTotal } from '../../models/personal-library';

export interface HomeState {
  recommendedBooks: IBookItemTransformedWithTotal | null;
  loading: boolean;
}
export interface HomeNowState {
  readingNowBooks: IBookItemTransformedWithTotal | null;
  loading: boolean;
}
