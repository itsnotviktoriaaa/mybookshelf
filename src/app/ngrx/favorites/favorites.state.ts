import { arrayFromBookItemTransformedInterface } from '../../../types/user/book.interface';

export interface FavoritesState {
  favoritesBooks: arrayFromBookItemTransformedInterface | null;
}
