import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../core';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit, OnDestroy {
  loader: boolean = false;
  getNotificationLoaderDestroy$: Subject<void> = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotificationLoader()
      .pipe(
        tap((param: boolean): void => {
          this.loader = param;
        }),
        takeUntil(this.getNotificationLoaderDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.getNotificationLoaderDestroy$.next();
    this.getNotificationLoaderDestroy$.complete();
  }
}
