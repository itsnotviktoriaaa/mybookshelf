import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarComponent } from './star.component';

describe('StarComponent', (): void => {
  let component: StarComponent;
  let fixture: ComponentFixture<StarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarComponent);
    component = fixture.componentInstance;
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should show first star if rating more or equality 1', (done: DoneFn): void => {
    component.rating = 1;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      expect(firstStar.classList.contains('active')).toBeTruthy();
      done();
    });
  });

  it('should show first, second stars if rating more or equality 2', (done: DoneFn): void => {
    component.rating = 2;
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      const secondStar = fixture.nativeElement.querySelectorAll('span')[1];
      expect(firstStar.classList.contains('active')).toBeTruthy();
      expect(secondStar.classList.contains('active')).toBeTruthy();
      done();
    });
  });

  it('should show first, second, third stars if rating more or equality 3', (done: DoneFn): void => {
    component.rating = 3;
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      const secondStar = fixture.nativeElement.querySelectorAll('span')[1];
      const thirdStar = fixture.nativeElement.querySelectorAll('span')[2];
      expect(firstStar.classList.contains('active')).toBeTruthy();
      expect(secondStar.classList.contains('active')).toBeTruthy();
      expect(thirdStar.classList.contains('active')).toBeTruthy();
      done();
    });
  });

  it('should show first, second, third, fourth stars if rating more or equality 4', (done: DoneFn): void => {
    component.rating = 4;
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      const secondStar = fixture.nativeElement.querySelectorAll('span')[1];
      const thirdStar = fixture.nativeElement.querySelectorAll('span')[2];
      const fourthStar = fixture.nativeElement.querySelectorAll('span')[3];
      expect(firstStar.classList.contains('active')).toBeTruthy();
      expect(secondStar.classList.contains('active')).toBeTruthy();
      expect(thirdStar.classList.contains('active')).toBeTruthy();
      expect(fourthStar.classList.contains('active')).toBeTruthy();
      done();
    });
  });

  it('should show first, second, third, fourth, fifth stars if rating equality 5', (done: DoneFn): void => {
    component.rating = 5;
    fixture.detectChanges();

    fixture.whenStable().then((): void => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      const secondStar = fixture.nativeElement.querySelectorAll('span')[1];
      const thirdStar = fixture.nativeElement.querySelectorAll('span')[2];
      const fourthStar = fixture.nativeElement.querySelectorAll('span')[3];
      const fifthStar = fixture.nativeElement.querySelectorAll('span')[4];
      expect(firstStar.classList.contains('active')).toBeTruthy();
      expect(secondStar.classList.contains('active')).toBeTruthy();
      expect(thirdStar.classList.contains('active')).toBeTruthy();
      expect(fourthStar.classList.contains('active')).toBeTruthy();
      expect(fifthStar.classList.contains('active')).toBeTruthy();
      done();
    });
  });

  it('should not show if rating less then 1', (done: DoneFn): void => {
    component.rating = 0.9;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const firstStar = fixture.nativeElement.querySelectorAll('span')[0];
      expect(firstStar.classList.contains('active')).toBeFalse();
      done();
    });
  });
});
