import { NotificationStatusEnum, NotificationType } from 'app/modals/';
import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationService } from 'app/core/';
import { finalize, takeUntil, tap } from 'rxjs';
import { DestroyDirective } from 'app/core/';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass, NgStyle],
  hostDirectives: [DestroyDirective],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  message: string | null = null;
  timeout: number = 0;
  protected readonly NotificationStatusEnum = NotificationStatusEnum;
  status!:
    | NotificationStatusEnum.error
    | NotificationStatusEnum.success
    | NotificationStatusEnum.info;
  private readonly destroy$ = inject(DestroyDirective).destroy$;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotification()
      .pipe(
        tap((obj: NotificationType): void => {
          this.message = obj.message;
          this.status = obj.status;
          this.timeout = window.setTimeout((): void => {
            this.setMessageLikeNull();
          }, 4000);
        }),
        finalize(() => {
          clearTimeout(this.timeout);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  setMessageLikeNull(): void {
    this.message = null;
  }
}
