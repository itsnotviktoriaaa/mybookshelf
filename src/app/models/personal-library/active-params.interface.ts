export interface IActiveParams {
  page?: number;
  show: 'recommended' | 'reading';
}

export type IActiveParamsSearch = {
  q: string;
  maxResults: number;
  startIndex: number;
};
