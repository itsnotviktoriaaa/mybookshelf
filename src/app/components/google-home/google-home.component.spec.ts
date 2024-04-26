import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleHomeComponent } from './google-home.component';

describe('GoogleHomeComponent', () => {
  let component: GoogleHomeComponent;
  let fixture: ComponentFixture<GoogleHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
