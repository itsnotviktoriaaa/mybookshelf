import { IBookItemTransformedWithTotal } from 'app/models';

export interface FavoritesState {
  favoritesBooks: IBookItemTransformedWithTotal | null;
  isLoading: boolean;
}
