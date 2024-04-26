import { arrayFromBookItemTransformedInterface } from '../../modals/user';

export interface FavoritesState {
  favoritesBooks: arrayFromBookItemTransformedInterface | null;
}
