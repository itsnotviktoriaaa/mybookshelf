export interface ActiveParamsType {
  page?: number;
  show: 'recommended' | 'reading';
}

export type ActiveParamsSearchType = {
  q: string;
  maxResults: number;
  startIndex: number;
};

export enum NamesOfKeys {
  all = 'all',
  intitle = 'title',
  inauthor = 'author',
  intext = 'text',
  subject = 'subject',
}
