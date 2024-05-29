import { IBookItemTransformed } from '../../models/user';

export interface MyBooksState {
  myBooks: IBookItemTransformed[] | null;
  isLoading: boolean;
}
