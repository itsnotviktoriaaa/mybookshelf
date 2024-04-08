import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimodalComponent } from './minimodal.component';

describe('MinimodalComponent', () => {
  let component: MinimodalComponent;
  let fixture: ComponentFixture<MinimodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimodalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MinimodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
