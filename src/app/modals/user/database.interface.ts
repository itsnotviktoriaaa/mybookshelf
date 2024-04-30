import { SelfBookUploadInterface } from './self-book.interface';

export interface UploadFilesAndCreateBookDatabaseInterface {
  pdfPath: string;
  pdfInput: HTMLInputElement;
  pdfContentType: string;
  photoPath: string;
  photoInput: HTMLInputElement;
  photoContentType: string;
  selfBook: SelfBookUploadInterface;
}
