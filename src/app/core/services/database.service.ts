import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  IBookItemTransformed,
  ISelfBook,
  ISelfBookUpload,
  IUploadFilesAndCreateBookDatabase,
} from 'models/';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { catchError, forkJoin, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CollectionReference, DocumentData } from '@firebase/firestore';
import { UploadMetadata } from '@angular/fire/storage';
import { AuthFirebaseFacade } from 'app/ngrx';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _collection: CollectionReference | null = null;
  path: string | null = null;

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authFirebaseFacade: AuthFirebaseFacade
  ) {}

  getSelfBooks(): Observable<DocumentData[]> {
    return this.authFirebaseFacade.getCurrentUser().pipe(
      switchMap((user: string | null) => {
        if (user) {
          this.path = user;
          this._collection = collection(this.firestore, `users/${this.path}/books`);
          return this._collection ? collectionData(this._collection, { idField: 'id' }) : of([]);
        } else {
          return of([]);
        }
      })
    );
  }

  createSelfBook(selfBook: ISelfBook): Observable<unknown> {
    return this.authFirebaseFacade.getCurrentUser().pipe(
      switchMap((user: string | null) => {
        if (user) {
          this.path = user;
          this._collection = collection(this.firestore, `users/${this.path}/books`);
          return from(addDoc(this._collection, selfBook)).pipe(
            catchError(() => {
              return new Observable<void>(observer => {
                observer.error(new Error('Failed to create book'));
              });
            })
          );
        } else {
          return throwError(() => 'Failed to create book');
        }
      })
    );
  }

  getSelfBook(id: string): Observable<IBookItemTransformed | null> {
    return this.authFirebaseFacade.getCurrentUser().pipe(
      switchMap((user: string | null) => {
        if (user) {
          this.path = user;
          const document = doc(this.firestore, `users/${this.path}/books`, id);
          return from(getDoc(document)).pipe(
            switchMap(snapshot => {
              if (snapshot.exists()) {
                return of(snapshot.data() as IBookItemTransformed);
              } else {
                return of(null);
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  updateSelfBook(id: string, selfBook: ISelfBook): Observable<void> {
    return this.authFirebaseFacade.getCurrentUser().pipe(
      switchMap((user: string | null) => {
        if (user) {
          this.path = user;
          const document = doc(this.firestore, `users/${this.path}/books`, id);
          return from(updateDoc(document, { ...selfBook }));
        }
        return throwError(() => 'Sth went wrong');
      })
    );
  }

  deleteBookAndFile(id: string, urlPdf: string, urlPhoto: string): Observable<void> {
    const deleteBook$ = this.deleteSelfBook(id);
    const deleteFilePdf$ = this.deleteFileByUrl(urlPdf);
    const deleteFilePhoto$ = this.deleteFileByUrl(urlPhoto);

    return forkJoin({
      deleteBook: deleteBook$,
      deleteFilePdf: deleteFilePdf$,
      deleteFilePhoto: deleteFilePhoto$,
    }).pipe(
      map(() => undefined),
      catchError(error => {
        console.error('Error deleting book or file:', error);
        return throwError(() => error);
      })
    );
  }

  deleteSelfBook(id: string): Observable<void> {
    const document = doc(this.firestore, `users/${this.path}/books`, id);
    return from(deleteDoc(document)).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deleteFileByUrl(url: string): Observable<void> {
    const storageRef = ref(this.storage, url);
    return from(deleteObject(storageRef)).pipe(
      catchError(error => {
        console.error('Error deleting file:', error);
        throw error;
      })
    );
  }

  uploadToStorage(
    path: string,
    input: HTMLInputElement,
    contentType: UploadMetadata
  ): Observable<string | null> {
    return new Observable<string | null>(observer => {
      if (!input.files || input.files.length === 0) {
        observer.next(null);
        observer.complete();
        return;
      }

      const file = input.files[0];
      const randomId = Math.random().toString(36).substring(2);
      const imagePath: string = `${this.path}/${path}/${randomId}_${file.name}`;
      const storageRef = ref(this.storage, imagePath);

      uploadBytesResumable(storageRef, file, contentType)
        .then(() => getDownloadURL(storageRef))
        .then(url => {
          if (typeof url === 'string') {
            observer.next(url);
          }
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  uploadFilesAndCreateBook(
    data: IUploadFilesAndCreateBookDatabase
  ): Observable<NonNullable<unknown>> {
    const { pdfPath, pdfInput, pdfContentType, photoPath, photoInput, photoContentType, selfBook } =
      data;
    return this.authFirebaseFacade.getCurrentUser().pipe(
      switchMap((user: string | null) => {
        if (user) {
          this.path = user;
          return forkJoin([
            this.uploadToStorage(pdfPath, pdfInput, pdfContentType as UploadMetadata),
            this.uploadToStorage(photoPath, photoInput, photoContentType as UploadMetadata),
          ]).pipe(
            switchMap(([webReaderLink, thumbnail]) => {
              if (webReaderLink && thumbnail) {
                const selfBookAfterUploadedFiles: ISelfBookUpload | ISelfBook = selfBook;
                (selfBookAfterUploadedFiles as ISelfBook).webReaderLink = webReaderLink;
                (selfBookAfterUploadedFiles as ISelfBook).thumbnail = thumbnail;
                return this.createSelfBook(selfBookAfterUploadedFiles as ISelfBook).pipe(
                  catchError(() => {
                    return throwError(() => 'Sth went wrong');
                  }),
                  switchMap(() => of([]))
                );
              } else {
                return throwError(() => new Error('Failed to upload files'));
              }
            }),
            catchError(error => {
              return throwError(() => error);
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }
}
