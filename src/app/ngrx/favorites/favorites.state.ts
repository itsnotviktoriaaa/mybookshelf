import { IBookItemTransformedWithTotal } from '../../models/user';

export interface FavoritesState {
  favoritesBooks: IBookItemTransformedWithTotal | null;
  isLoading: boolean;
}
