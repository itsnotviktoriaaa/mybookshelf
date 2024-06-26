import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniLoaderComponent } from 'app/uicomponents/';

describe('MiniLoaderComponent', () => {
  let component: MiniLoaderComponent;
  let fixture: ComponentFixture<MiniLoaderComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [MiniLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
