import { Injectable } from '@angular/core';
import { NotificationType } from 'models/';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private loader$: Subject<boolean> = new Subject<boolean>();
  private notification$: Subject<NotificationType> = new Subject<NotificationType>();

  getNotification(): Observable<NotificationType> {
    return this.notification$.asObservable();
  }

  sendNotification(message: NotificationType): void {
    this.notification$.next(message);
  }

  getNotificationLoader(): Observable<boolean> {
    return this.loader$.asObservable();
  }

  setNotificationLoader(notification: boolean): void {
    this.loader$.next(notification);
  }
}
