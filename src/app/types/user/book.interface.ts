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
  userInfo?: { updated: string };
  volumeInfo: BookItemVolumeInfoInterface;
}

export interface BookItemAccessInfoInterface {
  accessViewStatus: string;
  country: string;
  embeddable: boolean;
  epub: { isAvailable: boolean; acsTokenLink?: string };
  pdf: { isAvailable: boolean; acsTokenLink?: string };
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
  buyLink?: string;
  country: string;
  isEbook: boolean;
  listPrice?: { amount: number; currencyCode: string };
  offers?: Array<{
    finskyOfferType: number;
    listPrice: { amountInMicros: number; currencyCode: string };
    retailPrice: { amountInMicros: number; currencyCode: string };
  }>;
  retailPrice?: { amount: number; currencyCode: string };
  saleability: string;
}

export interface BookItemVolumeInfoInterface {
  allowAnonLogging: boolean;
  authors: Array<string>;
  averageRating?: number;
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
  ratingsCount?: number;
  readingModes: { text: boolean; image: boolean };
  title: string;
}

export interface BookItemTransformedInterface {
  id: string;
  thumbnail: string;
  title: string;
  author: Array<string>;
  publishedDate: string;
  webReaderLink: string;
  pageCount: number;
  selfLink?: string;
  categories?: Array<string>;
  userInfo?: string;
  averageRating?: number;
}

export interface arrayFromBookItemTransformedInterface {
  items: BookItemTransformedInterface[];
  totalItems: number;
}

export interface DetailBookInterface {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors: Array<string>;
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: Array<{
      type: string;
      identifier: string;
    }>;
    readingModes: {
      text: boolean;
      image: boolean;
    };
    pageCount: number;
    printedPageCount: number;
    dimensions: {
      height: string;
      width: string;
      thickness: string;
    };
    printType: string;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  layerInfo: {
    layers: Array<{
      layerId: string;
      volumeAnnotationsVersion: string;
    }>;
  };
  userInfo: {
    updated: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
    };
    pdf: {
      isAvailable: boolean;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
}

export interface DetailBookSmallInfo {
  id: string;
  title: string;
  authors: Array<string>;
  publishedDate: string;
  publisher: string;
  averageRating?: number;
  accessInfo: string[];
  thumbnail: string;
  description: string;
  webReaderLink: string;
}

export interface SearchInfoDetail {
  kind: string;
  totalItems: number;
  items: Array<{
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
      title: string;
      subtitle: string;
      authors: string[];
      publisher: string;
      publishedDate: string;
      description: string;
      industryIdentifiers: Array<{
        type: string;
        identifier: string;
      }>;
      readingModes: {
        text: boolean;
        image: boolean;
      };
      pageCount: number;
      printType: string;
      categories: string[];
      maturityRating: string;
      allowAnonLogging: boolean;
      contentVersion: string;
      panelizationSummary: {
        containsEpubBubbles: boolean;
        containsImageBubbles: boolean;
      };
      imageLinks: {
        smallThumbnail: string;
        thumbnail: string;
      };
      language: string;
      previewLink: string;
      infoLink: string;
      canonicalVolumeLink: string;
    };
    saleInfo: {
      country: string;
      saleability: string;
      isEbook: boolean;
      listPrice: {
        amount: number;
        currencyCode: string;
      };
      retailPrice: {
        amount: number;
        currencyCode: string;
      };
      buyLink: string;
      offers?: never;
    };
    accessInfo: {
      country: string;
      viewability: string;
      embeddable: boolean;
      publicDomain: boolean;
      textToSpeechPermission: string;
      epub: {
        isAvailable: boolean;
      };
      pdf: {
        isAvailable: boolean;
      };
      webReaderLink: string;
      accessViewStatus: string;
      quoteSharingAllowed: boolean;
    };
    searchInfo: {
      textSnippet: string;
    };
  }>;
}

export interface SearchSmallInterface {
  totalItems: number;
  items: Array<{ id: string; thumbnail: string; title: string }>;
}

export interface SearchInterface {
  totalItems: number;
  items: SearchDetailInterface[];
}
export interface SearchDetailInterface {
  id?: string;
  title?: string;
  authors?: Array<string>;
  publishedDate?: string;
  publisher?: string;
  thumbnail: string;
  categories?: Array<string>;
  pageCount?: number;
}

export interface ActionsInterface {
  svg: string;
  title: string;
}
