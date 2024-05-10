import { IBookItemTransformedWithTotal } from '../../modals/user';

export interface HomeState {
  recommendedBooks: IBookItemTransformedWithTotal | null;
  loading: boolean;
}
export interface HomeNowState {
  readingNowBooks: IBookItemTransformedWithTotal | null;
  loading: boolean;
}
