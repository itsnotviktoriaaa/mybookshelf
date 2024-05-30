import { IDetailBookSmallInfo } from 'app/models';

export interface DetailBookState {
  detailBook: IDetailBookSmallInfo | null;
  isLoading: boolean;
}
