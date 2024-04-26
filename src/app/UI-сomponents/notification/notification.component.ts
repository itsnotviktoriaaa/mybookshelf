import { NotificationStatus, NotificationType } from '../../modals/auth';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationService } from '../../core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string | null = null;
  timeout: number = 0;
  protected readonly NotificationStatusEnum = NotificationStatus;
  notificationServiceDestroy$: Subject<void> = new Subject<void>();
  status!: NotificationStatus.error | NotificationStatus.success | NotificationStatus.info;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotification()
      .pipe(
        tap((obj: NotificationType): void => {
          this.message = obj.message;
          this.status = obj.status;
          this.timeout = window.setTimeout((): void => {
            this.message = null;
          }, 4000);
        }),
        finalize(() => {
          clearTimeout(this.timeout);
        }),
        takeUntil(this.notificationServiceDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notificationServiceDestroy$.next();
    this.notificationServiceDestroy$.complete();
  }
}
