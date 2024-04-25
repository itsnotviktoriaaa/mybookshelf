import { Injectable } from '@angular/core';
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
  catchError,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SelfBookInterface, SelfBookUploadInterface } from '../../types/user/self-book.interface';
import { AuthService } from '../../core';
import { CollectionReference, DocumentData } from '@firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage';
import { BookItemTransformedInterface } from '../../types/user';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _collection: CollectionReference | null = null;
  path: string | null = null;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private storage: Storage
  ) {
    this.authService.user$
      .pipe(
        filter(user => {
          return user !== null;
        }),
        tap(user => {
          this.authService.currentUserSig.set({
            email: user!.email!,
            username: user!.displayName!,
            uid: user!.uid,
          });
          this.path = user!.uid;
          this._collection = collection(this.firestore, `users/${this.path}/books`);
        })
      )
      .subscribe();
  }

  getSelfBooks(): Observable<DocumentData[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.uid) {
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!,
            uid: user.uid,
          });
          this.path = user.uid;
          this._collection = collection(this.firestore, `users/${this.path}/books`);
          return this._collection ? collectionData(this._collection, { idField: 'id' }) : of([]);
        } else {
          return of([]);
        }
      })
    );
  }

  createSelfBook(selfBook: SelfBookInterface): Observable<unknown> {
    if (!this._collection) {
      return new Observable<void>(observer => {
        observer.error(new Error('Oops... Your book collection has not been loaded'));
      });
    }
    return from(addDoc(this._collection, selfBook)).pipe(
      catchError(() => {
        return new Observable<void>(observer => {
          observer.error(new Error('Failed to create book'));
        });
      })
    );
  }

  getSelfBook(id: string): Observable<BookItemTransformedInterface | undefined> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.uid) {
          this.path = user.uid;
          const document = doc(this.firestore, `users/${this.path}/books`, id);
          return from(getDoc(document)).pipe(
            switchMap(snapshot => {
              if (snapshot.exists()) {
                return of(snapshot.data() as BookItemTransformedInterface);
              } else {
                return of(undefined);
              }
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  updateSelfBook(id: string, selfBook: SelfBookInterface): Observable<void> {
    const uid = this.authService.currentUserSig()?.uid;
    if (uid) {
      const document = doc(this.firestore, `users/${uid}/books`, id);
      return from(updateDoc(document, { ...selfBook }));
    }
    return throwError(() => 'dont have uid');
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
      map(() => {
        console.log('Book and files deleted successfully');
      }),
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

  async uploadToStorage(path: string, input: HTMLInputElement, contentType: UploadMetadata) {
    if (!input.files) return null;
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const imagePath: string = `${this.path}/${path}/${file.name}`;
        const storageRef = ref(this.storage, imagePath);
        await uploadBytesResumable(storageRef, file, contentType);
        return await getDownloadURL(storageRef);
      }
    }
    return null;
  }

  uploadFilesAndCreateBook(
    pdfPath: string,
    pdfInput: HTMLInputElement,
    pdfContentType: string,
    photoPath: string,
    photoInput: HTMLInputElement,
    photoContentType: string,
    selfBook: SelfBookUploadInterface
  ): Observable<void> {
    return new Observable(observer => {
      Promise.all([
        this.uploadToStorage(pdfPath, pdfInput, pdfContentType as UploadMetadata),
        this.uploadToStorage(photoPath, photoInput, photoContentType as UploadMetadata),
      ])
        .then(([webReaderLink, thumbnail]): void => {
          const selfBookAfterUploadedFiles: SelfBookUploadInterface | SelfBookInterface = selfBook;
          if (webReaderLink && thumbnail) {
            (selfBookAfterUploadedFiles as SelfBookInterface).webReaderLink = webReaderLink;
            (selfBookAfterUploadedFiles as SelfBookInterface).thumbnail = thumbnail;
            this.createSelfBook(selfBookAfterUploadedFiles as SelfBookInterface).subscribe({
              next: () => observer.next(),
              error: error => observer.error(error),
              complete: () => observer.complete(),
            });
          } else {
            observer.error(new Error('Failed to upload files'));
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
