import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { catchError, filter, from, Observable, of, switchMap, tap } from 'rxjs';
import { SelfBookInterface, SelfBookUploadInterface } from '../../types/user/self-book.interface';
import { AuthService } from '../../core';
import { CollectionReference, DocumentData } from '@firebase/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage';
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
          return this._collection ? collectionData(this._collection) : of([]);
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

  async uploadToStorage(path: string, input: HTMLInputElement, contentType: UploadMetadata) {
    if (!input.files) return null;
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const imagePath: string = `${path}/${file.name}`;
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
        .then(([pdfUrl, photoUrl]): void => {
          const selfBookAfterUploadedFiles: SelfBookUploadInterface | SelfBookInterface = selfBook;
          if (pdfUrl && photoUrl) {
            (selfBookAfterUploadedFiles as SelfBookInterface).pdfUrl = pdfUrl;
            (selfBookAfterUploadedFiles as SelfBookInterface).photoUrl = photoUrl;
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
