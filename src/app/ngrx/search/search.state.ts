import { ISearch } from '../../models/personal-library';

export interface SearchState {
  search: ISearch | null;
  isLoading: boolean;
}
