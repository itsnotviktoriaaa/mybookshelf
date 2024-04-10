import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationStatus, NotificationType } from '../../../types/auth';
import { finalize, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string | null = null;
  protected readonly NotificationStatusEnum = NotificationStatus;
  status!: NotificationStatus.error | NotificationStatus.success | NotificationStatus.info;
  notificationService: NotificationService = inject(NotificationService);
  timeout: number = 0;
  notificationServiceDestroy$: Subject<void> = new Subject<void>();

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
