import { IBookItemTransformed } from '../../modals/user';

export interface MyBooksState {
  myBooks: IBookItemTransformed[] | null;
  isLoading: boolean;
}
