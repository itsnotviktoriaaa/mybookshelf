import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { catchError, EMPTY, filter, Observable, of, tap } from 'rxjs';
import { DatabaseService, NotificationService } from '../../../core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationStatusEnum } from '../../../modals/auth';
import { IBookItemTransformed } from '../../../modals/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-example-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, SvgIconComponent, AsyncPipe],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent {
  /** In most cases, you don't need the NgxExtendedPdfViewerService. It allows you
   *  to use the "find" api, to extract text and images from a PDF file,
   *  to print programmatically, and to show or hide layers by a method call.
   */
  book$: Observable<IBookItemTransformed | null> = of(null);
  examplePdfUrl =
    'https://firebasestorage.googleapis.com/v0/b/mybookshelff-c1a0f.appspot.com/o/EXCj50C0ruWGrJumrcfbjknFxik2%2Fpdfs%2F2rrspocd0fo_RETRO%2019.04.2024.pdf?alt=media&token=b529b2b2-5d77-4779-a4c8-122e34cda9b5';

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    private routerFacadeService: RouterFacadeService,
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    /* More likely than not you don't need to tweak the pdfDefaultOptions.
       They are a collecton of less frequently used options.
       To illustrate how they're used, here are two example settings: */
    // pdfDefaultOptions.doubleTapZoomFactor = '150%'; // The default value is '200%'
    // pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
    // but most devices support much higher resolutions.
    // Increasing this setting allows your users to use higher zoom factors,
    // trading image quality for performance.

    this.routerFacadeService.getParams$
      .pipe(
        tap((params: Params): void => {
          this.getInfoAboutBook(params['id']);
        })
      )
      .subscribe();
  }

  getInfoAboutBook(id: string): void {
    this.book$ = this.databaseService.getSelfBook(id).pipe(
      filter((selfBook: IBookItemTransformed | null) => Boolean(selfBook)),
      catchError(() => {
        this.notificationService.notifyAboutNotification({
          message: 'Something went wrong',
          status: NotificationStatusEnum.error,
        });
        this.router.navigate(['/home/books']).then((): void => {});
        return EMPTY;
      })
    );
  }

  backToMyBooks(): void {
    this.router.navigate(['/home/books']).then((): void => {});
  }
}
