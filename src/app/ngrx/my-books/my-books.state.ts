import { IBookItemTransformed } from '../../models/personal-library';

export interface MyBooksState {
  myBooks: IBookItemTransformed[] | null;
  isLoading: boolean;
}
