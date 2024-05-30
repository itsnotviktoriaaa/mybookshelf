import { BehaviorSubject, catchError, EMPTY, filter, Observable, of, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DatabaseService, NotificationService } from 'core/';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { NotificationStatusEnum } from 'models/';
import { IBookItemTransformed } from 'models/';
import { AsyncPipe } from '@angular/common';
import { RouterFacadeService } from 'ngr/';
import { MiniLoaderComponent } from 'ui/';
import { DestroyDirective } from 'core/';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [
    NgxExtendedPdfViewerModule,
    SvgIconComponent,
    AsyncPipe,
    TranslateModule,
    MiniLoaderComponent,
  ],
  hostDirectives: [DestroyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent {
  book$: Observable<IBookItemTransformed | null> = of(null);
  pathToIcons = environment.pathToIcons;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private readonly destroy$ = inject(DestroyDirective).destroy$;

  listOfViewsAboutSpread = [
    { translate: 'pdf-viewer-list-of-views-spread.secondarySpreadNone', id: 'secondarySpreadNone' },
    { translate: 'pdf-viewer-list-of-views-spread.secondarySpreadOdd', id: 'secondarySpreadOdd' },
    { translate: 'pdf-viewer-list-of-views-spread.secondarySpreadEven', id: 'secondarySpreadEven' },
  ];

  listOfViewsAboutScrolling = [
    {
      translate: 'pdf-viewer-list-of-views-scrolling.secondaryScrollVertical',
      id: 'secondaryScrollVertical',
    },
    {
      translate: 'pdf-viewer-list-of-views-scrolling.secondaryScrollHorizontal',
      id: 'secondaryScrollHorizontal',
    },
    {
      translate: 'pdf-viewer-list-of-views-scrolling.secondaryScrollWrapped',
      id: 'secondaryScrollWrapped',
    },
  ];

  constructor(
    private routerFacadeService: RouterFacadeService,
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    this.routerFacadeService.getParams$
      .pipe(
        filter((params: Params) => Boolean(params['id'])),
        tap((params: Params): void => {
          this.getInfoAboutBook(params['id']);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getInfoAboutBook(id: string): void {
    this.book$ = this.databaseService.getSelfBook(id).pipe(
      filter((selfBook: IBookItemTransformed | null) => Boolean(selfBook)),
      catchError(() => {
        const messageKey = 'message.somethingWentWrong';
        const message = this.translateService.instant(messageKey);
        this.notificationService.sendNotification({
          message: message,
          status: NotificationStatusEnum.ERROR,
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

    const selectedOptionId = listOfViewChanged.find(view => view.translate === selectedOptionValue);

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

  onPdfLoad(isLoad: 'pdfLoaded' | 'pdfLoadingFailed'): void {
    if (isLoad === 'pdfLoaded') {
      this.isLoading$.next(false);
    } else if (isLoad === 'pdfLoadingFailed') {
      this.isLoading$.next(false);
      const messageKey = 'message.somethingWentWrong';
      const message = this.translateService.instant(messageKey);
      this.notificationService.sendNotification({
        message: message,
        status: NotificationStatusEnum.ERROR,
      });
      this.router.navigate(['/home/books']).then((): void => {});
    }
  }
}
