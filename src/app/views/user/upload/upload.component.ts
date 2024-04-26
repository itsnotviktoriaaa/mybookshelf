import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { UploadMetadata } from '@angular/fire/storage';
import { SvgIconComponent } from 'angular-svg-icon';
import { DatabaseService, NotificationService } from '../../../core';
import { NotificationStatus } from '../../../modals/auth';
import { SelfBookInterface, SelfBookUploadInterface } from '../../../modals/user';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, AsyncPipe, SvgIconComponent],
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
  pdfUrl = new BehaviorSubject<string | null>(null);
  photoUrl = new BehaviorSubject<string | null>(null);

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
      } else {
        this.uploadForm.reset();
        this.photoUrl.next(null);
        this.pdfUrl.next(null);
        this.id = null;
        this.edit = false;
        if (this.pdfFileInput && this.pdfFileInput.nativeElement) {
          this.pdfFileInput.nativeElement.value = '';
        }
        if (this.photoFileInput && this.photoFileInput.nativeElement) {
          this.photoFileInput.nativeElement.value = '';
        }
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
    if (this.pdfUrl.value && this.photoUrl.value) {
      this.notificationService.notifyAboutNotificationLoader(true);
      const selfBook: SelfBookInterface = {
        title: this.uploadForm.controls['title'].value,
        author: [this.uploadForm.controls['author'].value],
        description: this.uploadForm.controls['description'].value,
        publishedDate: new Date().toISOString(),
        webReaderLink: this.pdfUrl.value,
        thumbnail: this.photoUrl.value,
      };

      const deletePreviousPdf$ =
        this.pdfFile && this.pdfUrl.value
          ? this.databaseService.deleteFileByUrl(this.pdfUrl.value).pipe(
              tap(() => console.log('Previous PDF file deleted successfully')),
              catchError(error => {
                console.error('Error deleting previous PDF file:', error);
                return EMPTY;
              })
            )
          : of(null);

      const deletePreviousPhoto$ =
        this.photoFile && this.photoUrl.value
          ? this.databaseService.deleteFileByUrl(this.photoUrl.value).pipe(
              tap(() => console.log('Previous photo deleted successfully')),
              catchError(error => {
                console.error('Error deleting previous photo:', error);
                return EMPTY;
              })
            )
          : of(null);

      const uploadPdf$ = this.pdfFile
        ? this.uploadFile('pdfs', this.pdfFileInput?.nativeElement, 'application/pdf')
        : of(null);

      const uploadPhoto$ = this.photoFile
        ? this.uploadFile(
            'photos',
            this.photoFileInput?.nativeElement,
            (this.photoFile as File).type
          )
        : of(null);

      forkJoin([deletePreviousPdf$, deletePreviousPhoto$, uploadPdf$, uploadPhoto$]).subscribe({
        next: ([, , webReaderLink, thumbnail]) => {
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
                tap(() => {
                  this.notificationService.notifyAboutNotification({
                    message: 'Self book updated successfully',
                    status: NotificationStatus.success,
                  });
                }),
                catchError(() => {
                  this.notificationService.notifyAboutNotification({
                    message: 'Error updating self book',
                    status: NotificationStatus.error,
                  });
                  return EMPTY;
                }),
                finalize(() => {
                  this.notificationService.notifyAboutNotificationLoader(false);
                  this.router.navigate(['/home/books']).then((): void => {});
                })
              )
              .subscribe();
          }
        },
        error: error => {
          this.notificationService.notifyAboutNotificationLoader(false);
          console.error('Error uploading files:', error);
        },
      });
    }
  }

  private uploadFile(
    folder: string,
    inputElement: HTMLInputElement,
    contentType: string
  ): Observable<string | null> {
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
            this.pdfUrl.next(selfBook.webReaderLink);
            this.photoUrl.next(selfBook.thumbnail);
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
