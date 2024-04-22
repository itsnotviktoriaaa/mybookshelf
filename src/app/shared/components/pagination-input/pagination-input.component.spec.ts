import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationInputComponent } from './pagination-input.component';

describe('PaginationInputComponent', () => {
  let component: PaginationInputComponent;
  let fixture: ComponentFixture<PaginationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
