import { IBook, IBookItem, IBookItemTransformed } from 'app/models';

export class BookTransformUtil {
  static transformBook(data: IBook): IBookItemTransformed[] {
    return data.items.map((item: IBookItem) => {
      return {
        id: item.id,
        thumbnail: item.volumeInfo.imageLinks.thumbnail,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors,
        publishedDate: item.volumeInfo.publishedDate,
        webReaderLink: item.accessInfo.webReaderLink,
        pageCount: item.volumeInfo.pageCount,
        selfLink: item.selfLink,
        categories: item.volumeInfo.categories,
        userInfo: item.userInfo?.updated,
        averageRating: item.volumeInfo.averageRating,
      };
    });
  }
}
