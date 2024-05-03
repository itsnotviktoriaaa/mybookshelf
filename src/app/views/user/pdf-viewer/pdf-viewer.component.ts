import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { environment } from '../../../../environments/environment.development';
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

  listOfViewsAboutSpread = [
    { title: 'No Spreads', id: 'secondarySpreadNone' },
    { title: 'Odd Spreads', id: 'secondarySpreadOdd' },
    { title: 'Even Spreads', id: 'secondarySpreadEven' },
  ];

  listOfViewsAboutScrolling = [
    { title: 'Vertical Scrolling', id: 'secondaryScrollVertical' },
    { title: 'Horizontal Scrolling', id: 'secondaryScrollHorizontal' },
    { title: 'Wrapped Scrolling', id: 'secondaryScrollWrapped' },
  ];

  pathToIcons = environment.pathToIcons;

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

  customOpeningFullScreen(): void {
    const presentationButton: HTMLElement | null = document.getElementById('presentationMode');
    if (presentationButton) {
      presentationButton.click();
    }
  }

  chooseView(event: Event, listOfView: 'spread' | 'scrolling'): void {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    const selectedIndex = target.selectedIndex;
    const selectedOptionValue = target.options[selectedIndex].value;
    let listOfViewChanged = this.listOfViewsAboutSpread;

    if (listOfView === 'spread') {
      listOfViewChanged = this.listOfViewsAboutSpread;
    } else if (listOfView === 'scrolling') {
      listOfViewChanged = this.listOfViewsAboutScrolling;
    }

    const selectedOptionId = listOfViewChanged.find(view => view.title === selectedOptionValue);

    if (selectedOptionId && selectedOptionId.id) {
      const elementWhichNeedId: HTMLElement | null = document.getElementById(selectedOptionId.id);
      elementWhichNeedId?.click();
    }
  }

  edit(): void {
    const editButton: HTMLElement | null = document.getElementById('primaryEditorInk');
    if (editButton) {
      editButton.click();
    }
  }

  nextPrimary(): void {
    const primaryNext: HTMLElement | null = document.getElementById('primaryNext');
    if (primaryNext) {
      primaryNext.click();
    }
  }

  primaryPrevious(): void {
    const primaryPrevious: HTMLElement | null = document.getElementById('primaryPrevious');
    if (primaryPrevious) {
      primaryPrevious.click();
    }
  }

  download(): void {
    const download: HTMLElement | null = document.getElementById('download');
    if (download) {
      download.click();
    }
  }
}
