import { ISearch } from '../../models/user';

export interface SearchState {
  search: ISearch | null;
  isLoading: boolean;
}
