// Decorator for secure from subscribers

import { Observable, Subject, takeUntil } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function SubscribeDecorator(): MethodDecorator {
  return (target: any, name: string | symbol, descriptor: PropertyDescriptor) => {
    const stop$ = new Subject<void>();

    const originalOnDestroy = target.ngOnDestroy;
    target.ngOnDestroy = function (...args: any[]) {
      stop$.next();
      originalOnDestroy?.apply(this, args);
    };

    const origin = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const result: Observable<any> = origin.apply(this, args);
      return result.pipe(takeUntil(stop$));
    };
  };
}
