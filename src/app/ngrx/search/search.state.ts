import { ISearch } from 'app/models';

export interface SearchState {
  search: ISearch | null;
  isLoading: boolean;
}
