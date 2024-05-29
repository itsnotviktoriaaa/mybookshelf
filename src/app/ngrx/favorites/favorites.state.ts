import { IBookItemTransformedWithTotal } from '../../models/personal-library';

export interface FavoritesState {
  favoritesBooks: IBookItemTransformedWithTotal | null;
  isLoading: boolean;
}
