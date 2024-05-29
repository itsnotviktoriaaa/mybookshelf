import { IDetailBookSmallInfo } from '../../models/user';

export interface DetailBookState {
  detailBook: IDetailBookSmallInfo | null;
  isLoading: boolean;
}
