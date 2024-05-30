import {
  IBook,
  IBookItem,
  IBookItemAccessInfo,
  IBookItemLayerInfo,
  IBookItemSaleInfo,
  IBookItemTransformed,
  IBookItemTransformedWithTotal,
  IBookItemVolumeInfo,
  IDetailBook,
  IDetailBookSmallInfo,
  ISearch,
  ISearchDetail,
  ISearchInfoDetail,
} from 'app/models';
import { DocumentData } from '@firebase/firestore';
import { MyBooksState } from 'app/ngrx';

export const infoDetail: ISearchInfoDetail = {
  kind: 'books#volume',
  totalItems: 2,
  items: [
    {
      kind: 'books#volume',
      id: '1',
      etag: 'etag1',
      selfLink: 'link1',
      volumeInfo: {
        title: 'Book Title 1',
        subtitle: 'Subtitle 1',
        authors: ['Author 1'],
        publisher: 'Publisher 1',
        publishedDate: '2022-01-01',
        description: 'Description 1',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '1234567890' },
          { type: 'ISBN_13', identifier: '123-1234567890' },
        ],
        readingModes: { text: true, image: true },
        pageCount: 100,
        printType: 'BOOK',
        categories: ['Category 1', 'Category 2'],
        maturityRating: 'MATURE',
        allowAnonLogging: false,
        contentVersion: 'preview-1.0.0',
        panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
        imageLinks: { smallThumbnail: 'smallThumbnail1', thumbnail: 'thumbnail1' },
        language: 'en',
        previewLink: 'previewLink1',
        infoLink: 'infoLink1',
        canonicalVolumeLink: 'canonicalLink1',
      },
      saleInfo: {
        country: 'US',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: { amount: 9.99, currencyCode: 'USD' },
        retailPrice: { amount: 7.99, currencyCode: 'USD' },
        buyLink: 'buyLink1',
      },
      accessInfo: {
        country: 'US',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: { isAvailable: true },
        pdf: { isAvailable: true },
        webReaderLink: 'webReaderLink1',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: true,
      },
      searchInfo: { textSnippet: 'Text Snippet 1' },
    },
    {
      kind: 'books#volume',
      id: '2',
      etag: 'etag2',
      selfLink: 'link2',
      volumeInfo: {
        title: 'Book Title 2',
        subtitle: 'Subtitle 2',
        authors: ['Author 2'],
        publisher: 'Publisher 2',
        publishedDate: '2022-02-02',
        description: 'Description 2',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0987654321' },
          { type: 'ISBN_13', identifier: '987-0987654321' },
        ],
        readingModes: { text: true, image: true },
        pageCount: 200,
        printType: 'BOOK',
        categories: ['Category 3', 'Category 4'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: true,
        contentVersion: 'preview-2.0.0',
        panelizationSummary: { containsEpubBubbles: true, containsImageBubbles: true },
        imageLinks: { smallThumbnail: 'smallThumbnail2', thumbnail: 'thumbnail2' },
        language: 'en',
        previewLink: 'previewLink2',
        infoLink: 'infoLink2',
        canonicalVolumeLink: 'canonicalLink2',
      },
      saleInfo: {
        country: 'US',
        saleability: 'FOR_SALE',
        isEbook: false,
        listPrice: { amount: 9.99, currencyCode: 'USD' },
        retailPrice: { amount: 7.99, currencyCode: 'USD' },
        buyLink: 'https://example.com/buy',
      },
      accessInfo: {
        country: 'US',
        viewability: 'FULL',
        embeddable: true,
        publicDomain: true,
        textToSpeechPermission: 'ALLOWED',
        epub: { isAvailable: false },
        pdf: { isAvailable: false },
        webReaderLink: 'webReaderLink2',
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
        quoteSharingAllowed: false,
      },
      searchInfo: { textSnippet: 'Text Snippet 2' },
    },
  ],
};

export const mockSearchDetail1: ISearchDetail = {
  id: '1',
  title: 'Book Title 1',
  authors: ['Author 1', 'Author 2'],
  publishedDate: '2022-01-01',
  publisher: 'Publisher 1',
  thumbnail: 'thumbnail1.jpg',
  categories: ['Category 1', 'Category 2'],
  pageCount: 200,
};

export const mockSearchDetail2: ISearchDetail = {
  id: '2',
  title: 'Book Title 2',
  authors: ['Author 3'],
  publishedDate: '2022-02-01',
  publisher: 'Publisher 2',
  thumbnail: 'thumbnail2.jpg',
  categories: ['Category 3'],
  pageCount: 300,
};

export const mockSearch: ISearch = {
  totalItems: 2,
  items: [mockSearchDetail1, mockSearchDetail2],
};

export const mockBookFavItem: IBookItemTransformed = {
  id: 'book1',
  thumbnail: 'http://example.com/thumbnail.jpg',
  title: 'Test Book Title',
  author: ['Author One', 'Author Two'],
  publishedDate: '2023-01-01',
  webReaderLink: 'http://example.com/web-reader',
  pageCount: 320,
  selfLink: 'http://example.com/self',
  categories: ['Category One', 'Category Two'],
  userInfo: '2023-01-01',
  averageRating: 4.5,
};

export const mockBookItem: IBookItemTransformed = {
  id: '1',
  thumbnail: 'https://example.com/thumbnail.jpg',
  title: 'Sample Book',
  author: ['Author A', 'Author B'],
  publishedDate: '2023-01-01',
  webReaderLink: 'https://example.com/reader',
  pageCount: 300,
  selfLink: 'https://example.com/book/1',
  categories: ['Fiction', 'Science Fiction'],
  userInfo: 'User info about the book',
  averageRating: 4.5,
  description: 'Description of the book',
};

export const mockBookItemAccessInfo: IBookItemAccessInfo = {
  accessViewStatus: 'SAMPLE',
  country: 'US',
  embeddable: true,
  epub: {
    isAvailable: true,
    acsTokenLink: 'http://example.com/epub-token',
  },
  pdf: {
    isAvailable: false,
  },
  publicDomain: false,
  quoteSharingAllowed: true,
  textToSpeechPermission: 'ALLOWED',
  viewability: 'PARTIAL',
  webReaderLink: 'http://example.com/web-reader',
};

export const mockBookItemLayerInfo: IBookItemLayerInfo = {
  layers: [
    {
      layerId: 'layer1',
      volumeAnnotationsVersion: '1.0',
    },
  ],
};

export const mockBookItemSaleInfo: IBookItemSaleInfo = {
  buyLink: 'http://example.com/buy',
  country: 'US',
  isEbook: true,
  listPrice: {
    amount: 9.99,
    currencyCode: 'USD',
  },
  retailPrice: {
    amount: 7.99,
    currencyCode: 'USD',
  },
  saleability: 'FOR_SALE',
};

export const mockBookItemVolumeInfo: IBookItemVolumeInfo = {
  allowAnonLogging: true,
  authors: ['Author One', 'Author Two'],
  averageRating: 4.5,
  canonicalVolumeLink: 'http://example.com/canonical',
  categories: ['Category One', 'Category Two'],
  contentVersion: '1.0',
  description: 'A test book description',
  imageLinks: {
    smallThumbnail: 'http://example.com/small-thumbnail.jpg',
    thumbnail: 'http://example.com/thumbnail.jpg',
  },
  industryIdentifiers: [
    {
      type: 'ISBN_10',
      identifier: '1234567890',
    },
    {
      type: 'ISBN_13',
      identifier: '123-1234567890',
    },
  ],
  infoLink: 'http://example.com/info',
  maturityRating: 'NOT_MATURE',
  pageCount: 320,
  panelizationSummary: {
    containsEpubBubbles: false,
    containsImageBubbles: false,
  },
  previewLink: 'http://example.com/preview',
  printType: 'BOOK',
  publishedDate: '2023-01-01',
  publisher: 'Test Publisher',
  ratingsCount: 100,
  readingModes: {
    text: true,
    image: false,
  },
  title: 'Test Book Title',
};

export const mockBookItemT: IBookItem = {
  accessInfo: mockBookItemAccessInfo,
  etag: 'etag123',
  id: 'book1',
  kind: 'books#volume',
  layerInfo: mockBookItemLayerInfo,
  saleInfo: mockBookItemSaleInfo,
  selfLink: 'http://example.com/self',
  volumeInfo: mockBookItemVolumeInfo,
  userInfo: { updated: '2023-01-01' },
};

export const mockBook: IBook = {
  items: [mockBookItemT],
  kind: 'books#volumes',
  totalItems: 1,
};

export const mockBookItemWithTotal: IBookItemTransformedWithTotal = {
  items: [mockBookItem],
  totalItems: 1,
};

export const mockBookItemWithTotalFav: IBookItemTransformedWithTotal = {
  items: [mockBookFavItem],
  totalItems: 1,
};

export const mockBookItemWithTotalHome: IBookItemTransformedWithTotal = {
  items: [
    {
      id: 'book1',
      thumbnail: 'http://example.com/thumbnail.jpg',
      title: 'Test Book Title',
      author: ['Author One', 'Author Two'],
      publishedDate: '2023-01-01',
      webReaderLink: 'http://example.com/web-reader',
      pageCount: 320,
    },
  ],
  totalItems: 1,
};

export const testDetailBook: IDetailBook = {
  kind: 'books#volume',
  id: '123',
  etag: 'etag',
  selfLink: 'http://example.com/selfLink',
  volumeInfo: {
    title: 'Test Book',
    authors: ['Author One', 'Author Two'],
    publisher: 'Test Publisher',
    publishedDate: '2021-01-01',
    description: 'This is a test book.',
    industryIdentifiers: [
      {
        type: 'ISBN_10',
        identifier: '1234567890',
      },
      {
        type: 'ISBN_13',
        identifier: '123-1234567890',
      },
    ],
    readingModes: {
      text: true,
      image: false,
    },
    pageCount: 320,
    printedPageCount: 320,
    dimensions: {
      height: '20cm',
      width: '13cm',
      thickness: '2cm',
    },
    printType: 'BOOK',
    categories: ['Category One', 'Category Two'],
    averageRating: 4.5,
    ratingsCount: 100,
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: true,
    contentVersion: '1.2.3',
    panelizationSummary: {
      containsEpubBubbles: false,
      containsImageBubbles: false,
    },
    imageLinks: {
      smallThumbnail: 'http://example.com/smallThumbnail.jpg',
      thumbnail: 'http://example.com/thumbnail.jpg',
    },
    language: 'en',
    previewLink: 'http://example.com/previewLink',
    infoLink: 'http://example.com/infoLink',
    canonicalVolumeLink: 'http://example.com/canonicalVolumeLink',
  },
  layerInfo: {
    layers: [
      {
        layerId: 'layer1',
        volumeAnnotationsVersion: '1.0',
      },
    ],
  },
  userInfo: {
    updated: '2021-01-01T00:00:00Z',
  },
  saleInfo: {
    country: 'US',
    saleability: 'FOR_SALE',
    isEbook: true,
  },
  accessInfo: {
    country: 'US',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: 'ALLOWED',
    epub: {
      isAvailable: true,
    },
    pdf: {
      isAvailable: false,
    },
    webReaderLink: 'http://example.com/webReaderLink',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: true,
  },
};

export const testDetailBookSmallInfo: IDetailBookSmallInfo = {
  id: '123',
  title: 'Test Book',
  authors: ['Author One', 'Author Two'],
  publishedDate: '2021-01-01',
  publisher: 'Test Publisher',
  averageRating: 4.5,
  accessInfo: ['EPUB'],
  thumbnail: 'http://example.com/thumbnail.jpg',
  description: 'This is a test book.',
  webReaderLink: 'http://example.com/webReaderLink',
};

export const mockBooksDocumentData: DocumentData[] = [
  {
    id: '1',
    title: 'Book 1',
    author: ['Author 1'],
    webReaderLink: '',
    thumbnail: '',
    publishedDate: '',
    description: '',
  },
];

export const expectedTransformedBooks: IBookItemTransformed[] = [
  {
    id: '1',
    title: 'Book 1',
    author: ['Author 1'],
    webReaderLink: '',
    thumbnail: '',
    publishedDate: '',
    description: '',
  },
];

export const mockMyBooksState: MyBooksState = {
  myBooks: [
    {
      id: '1',
      thumbnail: 'https://example.com/thumbnail1.jpg',
      title: 'Book 1',
      author: ['Author 1'],
      publishedDate: '2022-05-19',
      webReaderLink: 'https://example.com/reader/book1',
    },
    {
      id: '2',
      thumbnail: 'https://example.com/thumbnail2.jpg',
      title: 'Book 2',
      author: ['Author 2'],
      publishedDate: '2022-05-20',
      webReaderLink: 'https://example.com/reader/book2',
    },
  ],
  isLoading: false,
};
