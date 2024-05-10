import { IDetailBookSmallInfo } from '../../modals/user';

export interface DetailBookState {
  detailBook: IDetailBookSmallInfo | null;
  isLoading: boolean;
}
