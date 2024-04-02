export interface BookInterface {
  items: Array<BookItemInterface>;
  kind: string;
  totalItems: number;
}

export interface BookItemInterface {
  accessInfo: BookItemAccessInfoInterface;
  etag: string;
  id: string;
  kind: string;
  layerInfo: BookItemLayerInfoInterface;
  saleInfo: BookItemSaleInfoInterface;
  selfLink: string;
  volumeInfo: BookItemVolumeInfoInterface;
}

export interface BookItemAccessInfoInterface {
  accessViewStatus: string;
  country: string;
  embeddable: boolean;
  epub: { isAvailable: boolean; acsTokenLink: string };
  pdf: { isAvailable: boolean; acsTokenLink: string };
  publicDomain: boolean;
  quoteSharingAllowed: boolean;
  textToSpeechPermission: string;
  viewability: string;
  webReaderLink: string;
}

export interface BookItemLayerInfoInterface {
  layers: Array<{
    layerId: string;
    volumeAnnotationsVersion: string;
  }>;
}

export interface BookItemSaleInfoInterface {
  buyLink: string;
  country: string;
  isEbook: boolean;
  listPrice: { amount: number; currencyCode: string };
  offers: Array<{ finskyOfferType: number; listPrice: { amountInMicros: number; currencyCode: string }; retailPrice: { amountInMicros: number; currencyCode: string } }>;
  retailPrice: { amount: number; currencyCode: string };
  saleability: string;
}

export interface BookItemVolumeInfoInterface {
  allowAnonLogging: boolean;
  authors: Array<string>;
  canonicalVolumeLink: string;
  categories: Array<string>;
  contentVersion: string;
  description: string;
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: Array<{ type: string; identifier: string }>;
  infoLink: string;
  maturityRating: string;
  pageCount: number;
  panelizationSummary: { containsEpubBubbles: boolean; containsImageBubbles: boolean };
  previewLink: string;
  printType: string;
  publishedDate: string;
  publisher: string;
  readingModes: { text: boolean; image: boolean };
  title: string;
}

export interface BookItemTransformedInterface {
  selfLink: string;
  thumbnail: string;
  title: string;
  author: Array<string>;
  publishedDate: string;
  fullPrice: string;
  categories: Array<string>;
  webReaderLink: string;
  pageCount: number;
  contentVersion: string;
  publisher: string;
}

export interface arrayFromBookItemTransformedInterface {
  items: BookItemTransformedInterface[];
  totalItems: number;
}
