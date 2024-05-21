import { SubscribeDecorator } from './subscribe-decorator';
import { Observable, of } from 'rxjs';

class TestComponent {
  @SubscribeDecorator()
  testMethod(): Observable<number> {
    return of(1, 2, 3);
  }

  ngOnDestroy() {
    // Placeholder for ngOnDestroy
  }
}

describe('SubscribeDecorator', () => {
  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent();
  });

  it('should return an observable that completes when ngOnDestroy is called', done => {
    const result = component.testMethod();
    const spy = jasmine.createSpy();

    result.subscribe({
      next: spy,
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(3);
        done();
      },
    });

    component.ngOnDestroy();
  });

  it('should complete the observable when ngOnDestroy is called', () => {
    const result = component.testMethod();
    const completeSpy = jasmine.createSpy('complete');

    result.subscribe({
      next: () => {},
      complete: completeSpy,
    });

    component.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });
});

describe('SubscribeDecorator', () => {
  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent();
  });

  it('should call the original ngOnDestroy method', () => {
    const spy = spyOn(component, 'ngOnDestroy').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
