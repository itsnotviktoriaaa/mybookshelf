import { TransformDateBookPipe } from './transform-date-book.pipe';

describe('TransformDateBookPipe', () => {
  let pipe: TransformDateBookPipe;
  const date = '2000';
  const bigDate = '20002';

  beforeEach((): void => {
    pipe = new TransformDateBookPipe();
  });

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  it('should return value if value is false', (): void => {
    const result: string = pipe.transform('');
    expect(result).toBe('');
  });

  it("should return default value if value's length is less than 5", (): void => {
    const result: string = pipe.transform(date);
    expect(result).toBe(date);
  });

  it("should return reducing value if value's length is more than 4", (): void => {
    const reducingDate: string = bigDate.slice(0, 4);
    const result: string = pipe.transform(bigDate);
    expect(result).toBe(reducingDate);
  });
});
