import { DestroyDirective } from './destroy.directive';
import { Observable } from 'rxjs';

describe('DestroyDirective', (): void => {
  let directive: DestroyDirective;

  beforeEach((): void => {
    directive = new DestroyDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return an Observable from destroy$', (): void => {
    const result: Observable<boolean> = directive.destroy$;
    expect(result).toBeInstanceOf(Observable);
  });

  it('should emit and complete when ngOnDestroy is called', (done: DoneFn): void => {
    const spyOnNext = spyOn(directive['_destroy$'], 'next').and.callThrough();
    const spyOnComplete = spyOn(directive['_destroy$'], 'complete').and.callThrough();

    directive.destroy$.subscribe({
      next: (value: boolean): void => {
        expect(value).toBe(true);
      },
      complete: (): void => {
        expect(spyOnComplete).toHaveBeenCalled();
        done();
      },
    });

    directive.ngOnDestroy();
    expect(spyOnNext).toHaveBeenCalledWith(true);
  });
});
