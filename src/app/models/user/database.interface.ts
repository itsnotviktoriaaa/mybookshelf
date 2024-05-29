import { ISelfBookUpload } from './self-book.interface';

export interface IUploadFilesAndCreateBookDatabase {
  pdfPath: string;
  pdfInput: HTMLInputElement;
  pdfContentType: string;
  photoPath: string;
  photoInput: HTMLInputElement;
  photoContentType: string;
  selfBook: ISelfBookUpload;
}
