import { TestBed } from '@angular/core/testing';

import { NotificationStatusEnum, NotificationType } from '../../models/auth';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';

describe('NotificationService', (): void => {
  let service: NotificationService;
  const testNotification = { message: 'message', status: NotificationStatusEnum.SUCCESS };

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should notification$ get value', (done: DoneFn): void => {
    service.getNotification().subscribe((obj: NotificationType): void => {
      expect(obj).toEqual(testNotification);
      done();
    });

    service.notifyAboutNotification(testNotification);
  });

  it('should return an Observable of NotificationType', (done: DoneFn): void => {
    const result: Observable<NotificationType> = service.getNotification();
    result.subscribe((notification: NotificationType): void => {
      expect(notification).toEqual(testNotification);
      expect(result).toBeInstanceOf(Observable);
      done();
    });

    service.notifyAboutNotification(testNotification);
  });

  it('should loader$ get true', (done: DoneFn): void => {
    service.getNotificationLoader().subscribe((param: boolean): void => {
      expect(param).toBe(true);
      done();
    });

    service.notifyAboutNotificationLoader(true);
  });

  it('should loader$ get false', (done: DoneFn): void => {
    service.getNotificationLoader().subscribe((param: boolean): void => {
      expect(param).toBe(false);
      done();
    });

    service.notifyAboutNotificationLoader(false);
  });

  it('should return an Observable of boolean', (done: DoneFn): void => {
    const result: Observable<boolean> = service.getNotificationLoader();
    result.subscribe((param: boolean): void => {
      expect(param).toBe(true);
      expect(result).toBeInstanceOf(Observable);
      done();
    });

    service.notifyAboutNotificationLoader(true);
  });
});
