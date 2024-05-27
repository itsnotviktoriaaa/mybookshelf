export interface IQuotesSmall {
  _id: string;
  content: string;
  author: string;
}

export interface IQuotes extends IQuotesSmall {
  tags: Array<string>;
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}
