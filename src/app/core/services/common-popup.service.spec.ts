import { CommonPopupService } from './common-popup.service';
import { TestBed } from '@angular/core/testing';

describe('CommonPopupService', (): void => {
  let service: CommonPopupService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [CommonPopupService],
    });
    service = TestBed.inject(CommonPopupService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should set and get isDeleteOwnBook correctly', (done: DoneFn): void => {
    service.setIsDeleteOwnBookOrNot(true);
    service.getDeleteOwnBookOrNot().subscribe((value: boolean): void => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should set and get isDeleteOwnBook correctly with false', (done: DoneFn): void => {
    service.setIsDeleteOwnBookOrNot(false);
    service.getDeleteOwnBookOrNot().subscribe((value: boolean): void => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should set and get isDeleteFavoriteBook correctly', (done: DoneFn): void => {
    service.setIsDeleteFavoriteBookOrNot(true);
    service.getDeleteFavoriteBookOrNot().subscribe((value: boolean): void => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should set and get isDeleteFavoriteBook correctly with false', (done: DoneFn): void => {
    service.setIsDeleteFavoriteBookOrNot(false);
    service.getDeleteFavoriteBookOrNot().subscribe((value: boolean): void => {
      expect(value).toBe(false);
      done();
    });
  });
});
