import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationStatusEnum } from '../../modals/auth';
import { NotificationService } from '../../core';
import { of } from 'rxjs';

describe('NotificationComponent', (): void => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getNotification']);

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [{ provide: NotificationService, useValue: notificationServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('should have status-success', (done: DoneFn): void => {
    const notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

    notificationServiceSpy.getNotification.and.returnValue(
      of({
        message: 'Test message',
        status: NotificationStatusEnum.success,
      })
    );

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('status-success')).toBeTruthy();
      done();
    });
  });

  it('should have status-info', (done: DoneFn): void => {
    const notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

    notificationServiceSpy.getNotification.and.returnValue(
      of({
        message: 'Test message',
        status: NotificationStatusEnum.info,
      })
    );

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('status-info')).toBeTruthy();
      done();
    });
  });

  it('should have status-error', (done: DoneFn): void => {
    const notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

    notificationServiceSpy.getNotification.and.returnValue(
      of({
        message: 'Test message',
        status: NotificationStatusEnum.error,
      })
    );

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('status-error')).toBeTruthy();
      done();
    });
  });

  // it('should not have notification', fakeAsync(() => {
  //   const notificationServiceSpy = TestBed.inject(
  //     NotificationService
  //   ) as jasmine.SpyObj<NotificationService>;
  //
  //   notificationServiceSpy.getNotification.and.returnValue(
  //     of({
  //       message: 'Test message',
  //       status: NotificationStatusEnum.error,
  //     })
  //   );
  //
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //
  //   // Initially, message should be set
  //   expect(component.message).toBe('Test message');
  //
  //   // Advance time by 4000 ms
  //   tick(4100);
  //
  //   // Now, the message should be null
  //   expect(component.message).toBeNull();
  // }));
});
