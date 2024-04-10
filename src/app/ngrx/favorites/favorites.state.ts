import { arrayFromBookItemTransformedInterface } from '../../types/user';

export interface FavoritesState {
  favoritesBooks: arrayFromBookItemTransformedInterface | null;
}
