import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from 'app/UIComponents/';
import { NotificationService } from 'app/core/';
import { of } from 'rxjs';

describe('LoaderComponent', (): void => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async (): Promise<void> => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'getNotificationLoader',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoaderComponent, TranslateModule.forRoot()],
      providers: [{ provide: NotificationService, useValue: notificationServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;

    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should show loader if loader is true', (done: DoneFn): void => {
    notificationService.getNotificationLoader.and.returnValue(of(true));

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const loaderElement = fixture.nativeElement.querySelector('.loader-wrapper');
      expect(loaderElement).toBeTruthy();
      done();
    });
  });

  it('should hide loader if loader is false', (done: DoneFn): void => {
    notificationService.getNotificationLoader.and.returnValue(of(false));

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const loaderElement = fixture.nativeElement.querySelector('.loader-wrapper');
      expect(loaderElement).toBeNull();
      done();
    });
  });
});
