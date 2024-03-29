import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationStatus, NotificationType } from '../../../../types';
import { Subscription } from 'rxjs';

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
  timeout1: number | null = null;
  subscription1: Subscription | null = null;

  ngOnInit(): void {
    this.subscription1 = this.notificationService.getNotification().subscribe((obj: NotificationType): void => {
      this.message = obj.message;
      this.status = obj.status;
      this.timeout1 = window.setTimeout((): void => {
        this.message = null;
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    if (this.timeout1) {
      clearTimeout(this.timeout1);
    }

    this.subscription1?.unsubscribe();
  }
}
