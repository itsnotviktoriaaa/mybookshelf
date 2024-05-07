import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { catchError, EMPTY, filter, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { RouterFacadeService } from '../../../ngrx/router/router.facade';
import { DatabaseService, NotificationService } from '../../../core';
import { NotificationStatusEnum } from '../../../modals/auth';
import { IBookItemTransformed } from '../../../modals/user';
import { SvgIconComponent } from 'angular-svg-icon';
import { Params, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, SvgIconComponent, AsyncPipe, TranslateModule],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent implements OnInit, OnDestroy {
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
  private getParamsDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    private routerFacadeService: RouterFacadeService,
    private databaseService: DatabaseService,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    this.routerFacadeService.getParams$
      .pipe(
        tap((params: Params): void => {
          this.getInfoAboutBook(params['id']);
        }),
        takeUntil(this.getParamsDestroy$)
      )
      .subscribe();

    const browserLang: string | undefined = this.translateService.getBrowserLang();
    if (browserLang === 'ru') {
      this.listOfViewsAboutSpread = [
        { title: 'Без', id: 'secondarySpreadNone' },
        { title: 'Чётные', id: 'secondarySpreadOdd' },
        { title: 'Нечётные', id: 'secondarySpreadEven' },
      ];

      this.listOfViewsAboutScrolling = [
        { title: 'Вертикально', id: 'secondaryScrollVertical' },
        { title: 'Горизонтально', id: 'secondaryScrollHorizontal' },
        { title: 'Обтекание', id: 'secondaryScrollWrapped' },
      ];
    } else if (browserLang === 'en') {
      this.listOfViewsAboutSpread = [
        { title: 'No Spreads', id: 'secondarySpreadNone' },
        { title: 'Odd Spreads', id: 'secondarySpreadOdd' },
        { title: 'Even Spreads', id: 'secondarySpreadEven' },
      ];

      this.listOfViewsAboutScrolling = [
        { title: 'Vertical Scrolling', id: 'secondaryScrollVertical' },
        { title: 'Horizontal Scrolling', id: 'secondaryScrollHorizontal' },
        { title: 'Wrapped Scrolling', id: 'secondaryScrollWrapped' },
      ];
    }
  }

  ngOnInit(): void {
    this.translateService.onLangChange
      .pipe(
        tap((lang: LangChangeEvent): void => {
          if (lang.lang === 'en') {
            this.listOfViewsAboutSpread = [
              { title: 'No Spreads', id: 'secondarySpreadNone' },
              { title: 'Odd Spreads', id: 'secondarySpreadOdd' },
              { title: 'Even Spreads', id: 'secondarySpreadEven' },
            ];

            this.listOfViewsAboutScrolling = [
              { title: 'Vertical Scrolling', id: 'secondaryScrollVertical' },
              { title: 'Horizontal Scrolling', id: 'secondaryScrollHorizontal' },
              { title: 'Wrapped Scrolling', id: 'secondaryScrollWrapped' },
            ];
          } else if (lang.lang === 'ru') {
            this.listOfViewsAboutSpread = [
              { title: 'Без', id: 'secondarySpreadNone' },
              { title: 'Чётные', id: 'secondarySpreadOdd' },
              { title: 'Нечётные', id: 'secondarySpreadEven' },
            ];

            this.listOfViewsAboutScrolling = [
              { title: 'Вертикально', id: 'secondaryScrollVertical' },
              { title: 'Горизонтально', id: 'secondaryScrollHorizontal' },
              { title: 'Обтекание', id: 'secondaryScrollWrapped' },
            ];
          }
        })
      )
      .subscribe();
  }

  getInfoAboutBook(id: string): void {
    this.book$ = this.databaseService.getSelfBook(id).pipe(
      filter((selfBook: IBookItemTransformed | null) => Boolean(selfBook)),
      catchError(() => {
        const messageKey = 'somethingWentWrong';
        const message = this.translateService.instant(messageKey);
        this.notificationService.notifyAboutNotification({
          message: message,
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

  ngOnDestroy(): void {
    this.getParamsDestroy$.next();
    this.getParamsDestroy$.complete();
  }
}
