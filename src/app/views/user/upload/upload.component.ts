import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  SelfBookInterface,
  SelfBookUploadInterface,
} from '../../../types/user/self-book.interface';
import { NgStyle } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services';
import { NotificationStatus } from '../../../types/auth';
import { catchError, EMPTY, switchMap, take, tap } from 'rxjs';
import { UploadMetadata } from '@angular/fire/storage';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent implements OnInit {
  @ViewChild('pdfFileInput', { static: true }) pdfFileInput: ElementRef | null = null;
  @ViewChild('photoFileInput', { static: true }) photoFileInput: ElementRef | null = null;

  pdfFile: File | null = null;
  photoFile: File | null = null;
  uploadForm!: FormGroup;
  edit: boolean = false;
  id: string | null = null;
  pdfUrl: string | null = null;
  photoUrl: string | null = null;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      if (params['id']) {
        this.id = params['id'];
        this.setFormValue(params['id']);
        this.edit = true;
      }
    });
  }

  onPdfFileSelected(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files ? inputElement.files[0] : null;
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
    } else {
      inputElement.value = '';
      this.pdfFile = null;
      this.notificationService.notifyAboutNotification({
        message: 'It is not pdf format. Retry upload your pdf file',
        status: NotificationStatus.error,
      });
    }
  }

  onPhotoFileSelected(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files ? inputElement.files[0] : null;
    if (
      file &&
      (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')
    ) {
      this.photoFile = file;
    } else {
      inputElement.value = '';
      this.photoFile = null;
      this.notificationService.notifyAboutNotification({
        message: 'It is not png, jpeg or jpg. Retry upload your image',
        status: NotificationStatus.error,
      });
    }
  }

  upload(): void {
    if (
      this.pdfFileInput &&
      this.pdfFileInput.nativeElement &&
      this.photoFileInput &&
      this.photoFileInput.nativeElement &&
      this.uploadForm.valid
    ) {
      this.notificationService.notifyAboutNotificationLoader(true);
      const selfBook: SelfBookUploadInterface = {
        title: this.uploadForm.controls['title'].value,
        author: [this.uploadForm.controls['author'].value],
        description: this.uploadForm.controls['description'].value,
        publishedDate: new Date().toISOString(),
      };

      this.databaseService
        .uploadFilesAndCreateBook(
          'pdfs',
          this.pdfFileInput.nativeElement,
          'application/pdf',
          'photos',
          this.photoFileInput.nativeElement,
          (this.photoFile as File).type,
          selfBook
        )
        .pipe(
          tap((): void => {
            this.uploadForm.reset();
            if (this.pdfFileInput && this.pdfFileInput.nativeElement) {
              this.pdfFileInput.nativeElement.value = '';
            }
            if (this.photoFileInput && this.photoFileInput.nativeElement) {
              this.photoFileInput.nativeElement.value = '';
            }
            this.notificationService.notifyAboutNotificationLoader(false);
            console.log('Book created:');
            this.notificationService.notifyAboutNotification({
              message: 'Book created',
              status: NotificationStatus.success,
            });
            this.router.navigate(['/home/books']).then((): void => {});
          }),
          catchError(() => {
            this.notificationService.notifyAboutNotificationLoader(false);
            this.notificationService.notifyAboutNotification({
              message: 'Error creating book',
              status: NotificationStatus.error,
            });
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  editSelfBook(): void {
    if (this.pdfUrl && this.photoUrl) {
      const selfBook: SelfBookInterface = {
        title: this.uploadForm.controls['title'].value,
        author: [this.uploadForm.controls['author'].value],
        description: this.uploadForm.controls['description'].value,
        publishedDate: new Date().toISOString(),
        webReaderLink: this.pdfUrl,
        thumbnail: this.photoUrl,
      };

      if (this.pdfFile && this.pdfUrl) {
        this.databaseService
          .deleteFileByUrl(this.pdfUrl)
          .pipe(
            tap(() => {
              console.log('Previous PDF file deleted successfully');
            }),
            catchError(error => {
              console.error('Error deleting previous PDF file:', error);
              return EMPTY;
            })
          )
          .subscribe();
      }

      if (this.photoFile && this.photoUrl) {
        this.databaseService
          .deleteFileByUrl(this.photoUrl)
          .pipe(
            tap(() => {
              console.log('Previous photo deleted successfully');
            }),
            catchError(error => {
              console.error('Error deleting previous photo:', error);
              return EMPTY;
            })
          )
          .subscribe();
      }

      const uploadPdfPromise = this.pdfFile
        ? this.uploadFile('pdfs', this.pdfFileInput?.nativeElement, 'application/pdf')
        : Promise.resolve(null);

      const uploadPhotoPromise = this.photoFile
        ? this.uploadFile(
            'photos',
            this.photoFileInput?.nativeElement,
            (this.photoFile as File).type
          )
        : Promise.resolve(null);

      Promise.all([uploadPdfPromise, uploadPhotoPromise])
        .then(([webReaderLink, thumbnail]) => {
          if (webReaderLink) {
            selfBook.webReaderLink = webReaderLink;
          }
          if (thumbnail) {
            selfBook.thumbnail = thumbnail;
          }

          if (this.id) {
            this.databaseService
              .updateSelfBook(this.id, selfBook)
              .pipe(
                tap(data => {
                  console.log(data);
                  console.log('Self book updated successfully');
                }),
                catchError(error => {
                  console.error('Error updating self book:', error);
                  return EMPTY;
                })
              )
              .subscribe();
          }
        })
        .catch(error => {
          console.error('Error uploading files:', error);
        });
    }
  }

  private uploadFile(
    folder: string,
    inputElement: HTMLInputElement,
    contentType: string
  ): Promise<string | null> {
    return this.databaseService.uploadToStorage(
      folder,
      inputElement,
      contentType as UploadMetadata
    );
  }

  setFormValue(id: string): void {
    this.databaseService
      .getSelfBook(id)
      .pipe(
        take(1),
        switchMap(selfBook => {
          if (selfBook) {
            console.log(selfBook);
            this.uploadForm.patchValue({
              title: selfBook.title,
              author: selfBook.author[0],
              description: selfBook.description,
            });
            this.pdfUrl = selfBook.webReaderLink;
            this.photoUrl = selfBook.thumbnail;
          }
          return EMPTY;
        }),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe();
  }
}
