import { IBookItemTransformed } from 'app/models';

export interface MyBooksState {
  myBooks: IBookItemTransformed[] | null;
  isLoading: boolean;
}
