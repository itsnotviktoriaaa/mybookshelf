import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniModalComponent } from 'shared/components';

describe('MiniModalComponent', () => {
  let component: MiniModalComponent;
  let fixture: ComponentFixture<MiniModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
