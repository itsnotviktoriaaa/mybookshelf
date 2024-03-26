import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NgClass, NgStyle } from '@angular/common';
import { NotificationStatus, NotificationType } from '../../../../types/user.interface';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  message: string | null = null;
  protected readonly NotificationStatusEnum = NotificationStatus;
  status!: NotificationStatus.error | NotificationStatus.success | NotificationStatus.info;
  notificationService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.getNotification().subscribe((obj: NotificationType): void => {
      this.message = obj.message;
      this.status = obj.status;
      setTimeout((): void => {
        this.message = null;
      }, 4000);
    });
  }
}
