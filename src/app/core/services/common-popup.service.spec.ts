import { TestBed } from '@angular/core/testing';

import { CommonPopupService } from './common-popup.service';

describe('CommonPopupService', () => {
  let service: CommonPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
