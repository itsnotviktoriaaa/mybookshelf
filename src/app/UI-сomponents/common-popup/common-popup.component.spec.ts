import { CommonPopupService } from '../../core/services/common-popup.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonPopupComponent } from './common-popup.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CommonPopupComponent', (): void => {
  let component: CommonPopupComponent;
  let fixture: ComponentFixture<CommonPopupComponent>;

  beforeEach(async (): Promise<void> => {
    const commonPopupServiceSpy = jasmine.createSpyObj('CommonPopupService', [
      'setIsDeleteOwnBookOrNot',
      'setIsDeleteFavoriteBookOrNot',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonPopupComponent, TranslateModule.forRoot()],
      providers: [{ provide: CommonPopupService, useValue: commonPopupServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should show popup for deletion if all params exist', (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'own';

    fixture.detectChanges();
    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    fixture.whenStable().then((): void => {
      expect(commonPopupWrapperElement).toBeTruthy();
      done();
    });
  });

  it("shouldn't show popup for deletion if isOpen is false", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: false };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'own';

    fixture.detectChanges();
    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    fixture.whenStable().then((): void => {
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("shouldn't show popup for deletion if textForPopup doesn't exist", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: '' };
    component.page = 'own';

    fixture.detectChanges();
    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    fixture.whenStable().then((): void => {
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("shouldn't show popup for deletion if page doesn't exist", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = null;

    fixture.detectChanges();
    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    fixture.whenStable().then((): void => {
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("shouldn't show popup for deletion if all params doesn't exist", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: false };
    component.textForPopup = { text: '' };
    component.page = null;

    fixture.detectChanges();
    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    fixture.whenStable().then((): void => {
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("should hide popup if user clicks on 'No' and page is equality to own", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'own';

    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    component.notDelete();

    fixture.whenStable().then((): void => {
      expect(component.isOpenDeletePopup).toEqual({ isOpen: false });
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("should hide popup if user clicks on 'No' and page is equality to favorite", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'favorite';

    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    component.notDelete();

    fixture.whenStable().then((): void => {
      expect(component.isOpenDeletePopup).toEqual({ isOpen: false });
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("should hide popup if user clicks on 'Yes' and page is equality to own", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'own';

    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    component.delete();

    fixture.whenStable().then((): void => {
      expect(component.isOpenDeletePopup).toEqual({ isOpen: false });
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });

  it("should hide popup if user clicks on 'Yes' and page is equality to favorite", (done: DoneFn): void => {
    component.isOpenDeletePopup = { isOpen: true };
    component.textForPopup = { text: 'Delete sth' };
    component.page = 'favorite';

    const commonPopupWrapperElement = fixture.nativeElement.querySelector('.common-popup-wrapper');

    component.delete();

    fixture.whenStable().then((): void => {
      expect(component.isOpenDeletePopup).toEqual({ isOpen: false });
      expect(commonPopupWrapperElement).toBeNull();
      done();
    });
  });
});
