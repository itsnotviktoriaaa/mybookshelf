import { IDetailBookSmallInfo } from '../../models/personal-library';

export interface DetailBookState {
  detailBook: IDetailBookSmallInfo | null;
  isLoading: boolean;
}
