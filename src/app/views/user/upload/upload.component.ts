import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelfBookUploadInterface } from '../../../types/user/self-book.interface';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services';
import { NotificationStatus } from '../../../types/auth';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  @ViewChild('pdfFileInput', { static: true }) pdfFileInput: ElementRef | null = null;
  @ViewChild('photoFileInput', { static: true }) photoFileInput: ElementRef | null = null;

  pdfFile: File | null = null;
  photoFile: File | null = null;
  uploadForm!: FormGroup;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
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
}
