export interface ActiveParamsType {
  page?: number;
  show: 'recommended' | 'reading';
}

export type ActiveParamsSearchType = {
  q: string;
  maxResults: number;
  startIndex: number;
};
