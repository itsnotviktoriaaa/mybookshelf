import { NotificationStatusEnum, NotificationType } from '../../modals/auth';
import { DestroyDirective } from '../../core/directives/destroy.directive';
import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationService } from '../../core';
import { finalize, takeUntil, tap } from 'rxjs';

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
            this.message = null;
          }, 4000);
        }),
        finalize(() => {
          clearTimeout(this.timeout);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
