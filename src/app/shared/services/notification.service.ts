import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationType } from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification$: Subject<NotificationType> = new Subject<NotificationType>();
  loader$: Subject<boolean> = new Subject<boolean>();

  getNotification(): Observable<NotificationType> {
    return this.notification$.asObservable();
  }

  notifyAboutNotification(message: NotificationType): void {
    this.notification$.next(message);
  }

  getNotificationLoader(): Observable<boolean> {
    return this.loader$.asObservable();
  }

  notifyAboutNotificationLoader(notification: boolean): void {
    this.loader$.next(notification);
  }
}
