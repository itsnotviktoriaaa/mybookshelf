import {
  BehaviorSubject,
  catchError,
  debounceTime,
  EMPTY,
  filter,
  forkJoin,
  Observable,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatabaseService, NotificationService } from 'core/';
import { UploadMetadata } from '@angular/fire/storage';
import { AsyncPipe, NgStyle } from '@angular/common';
import { ISelfBook, ISelfBookUpload } from 'models/';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { NotificationStatusEnum } from 'models/';
import { RouterFacadeService } from 'ngr/';
import { DestroyDirective } from 'core/';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, AsyncPipe, SvgIconComponent, TranslateModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  hostDirectives: [DestroyDirective],
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
  pathToIcons = environment.pathToIcons;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService,
    private routerFacadeService: RouterFacadeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.routerFacadeService.getQueryParams$
      .pipe(debounceTime(1), takeUntil(this.destroy$))
      .subscribe((params: Params): void => {
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
      const messageKey = 'message.pdfFormatError';
      const message = this.translateService.instant(messageKey);
      this.notificationService.notifyAboutNotification({
        message: message,
        status: NotificationStatusEnum.error,
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
      const messageKey = 'message.imageFormatError';
      const message = this.translateService.instant(messageKey);
      this.notificationService.notifyAboutNotification({
        message: message,
        status: NotificationStatusEnum.error,
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
      const selfBook: ISelfBookUpload = {
        title: this.uploadForm.controls['title'].value,
        author: [this.uploadForm.controls['author'].value],
        description: this.uploadForm.controls['description'].value,
        publishedDate: new Date().toISOString(),
      };

      this.databaseService
        .uploadFilesAndCreateBook({
          pdfPath: 'pdfs',
          pdfInput: this.pdfFileInput.nativeElement,
          pdfContentType: 'application/pdf',
          photoPath: 'photos',
          photoInput: this.photoFileInput.nativeElement,
          photoContentType: (this.photoFile as File).type,
          selfBook: selfBook,
        })
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
            const messageKey = 'message.bookCreated';
            const message = this.translateService.instant(messageKey);
            this.notificationService.notifyAboutNotification({
              message: message,
              status: NotificationStatusEnum.success,
            });
            this.router.navigate(['/home/books']).then((): void => {});
          }),
          catchError(() => {
            this.notificationService.notifyAboutNotificationLoader(false);
            const messageKey = 'message.errorCreatingBook';
            const message = this.translateService.instant(messageKey);
            this.notificationService.notifyAboutNotification({
              message: message,
              status: NotificationStatusEnum.error,
            });
            return EMPTY;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  editSelfBook(): void {
    if (this.pdfUrl.value && this.photoUrl.value) {
      this.notificationService.notifyAboutNotificationLoader(true);
      const selfBook: ISelfBook = {
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

      forkJoin([deletePreviousPdf$, deletePreviousPhoto$, uploadPdf$, uploadPhoto$])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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
                    this.notificationService.notifyAboutNotificationLoader(false);
                    const messageKey = 'message.selfBookUpdatedSuccessfully';
                    const message = this.translateService.instant(messageKey);
                    this.notificationService.notifyAboutNotification({
                      message: message,
                      status: NotificationStatusEnum.success,
                    });
                    this.router.navigate(['/home/books']).then((): void => {});
                  }),
                  catchError(() => {
                    const messageKey = 'message.errorUpdatingSelfBook';
                    const message = this.translateService.instant(messageKey);
                    this.notificationService.notifyAboutNotification({
                      message: message,
                      status: NotificationStatusEnum.error,
                    });
                    return EMPTY;
                  }),
                  takeUntil(this.destroy$)
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
        filter(selfBook => Boolean(selfBook)),
        tap(selfBook => {
          this.uploadForm.patchValue({
            title: selfBook!.title,
            author: selfBook!.author[0],
            description: selfBook!.description,
          });
          this.pdfUrl.next(selfBook!.webReaderLink);
          this.photoUrl.next(selfBook!.thumbnail);
        }),
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
