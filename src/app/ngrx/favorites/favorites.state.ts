import { IBookItemTransformedWithTotal } from '../../modals/user';

export interface FavoritesState {
  favoritesBooks: IBookItemTransformedWithTotal | null;
}
