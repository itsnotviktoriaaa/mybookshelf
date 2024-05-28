import { TransformFavoriteDatePipe } from './transform-favorite-date.pipe';

describe('TransformFavoriteDatePipe', (): void => {
  let pipe: TransformFavoriteDatePipe;
  const date = '2024-05-03T05:25:11.245Z';
  const dateForEvening = '2024-05-03T15:25:11.245Z';
  const dateWhereMinutesLessThan10 = '2024-05-03T05:05:11.245Z';

  beforeEach((): void => {
    pipe = new TransformFavoriteDatePipe();
  });

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  it('should transform date for en', (): void => {
    const result: string = pipe.transform(date, 'en');
    const fullDate: Date = new Date(result);
    const hours: number = fullDate.getHours();
    const formattedHours: number = hours % 12 || 12;
    expect(result).toBe(`3 May 2024 ${formattedHours}:25 AM`);
  });

  it('should transform date for ru', (): void => {
    const result: string = pipe.transform(date, 'ru');
    const resultParts: string[] = result.split(':')[0].split(' ');
    const hours: string = resultParts[resultParts.length - 1];
    expect(result).toBe(`3 май 2024 ${hours}:25 AM`);
  });

  it('should show PM if hour more than 12', (): void => {
    const result: string = pipe.transform(dateForEvening, 'en');
    const fullDate: Date = new Date(result);
    const hours: number = fullDate.getHours();
    const formattedHours: number = hours % 12 || 12;
    expect(result).toBe(`3 May 2024 ${formattedHours}:25 PM`);
  });

  it('should show AM if hour less than 12', (): void => {
    const result: string = pipe.transform(date, 'en');
    const fullDate: Date = new Date(result);
    const hours: number = fullDate.getHours();
    const formattedHours: number = hours % 12 || 12;
    expect(result).toBe(`3 May 2024 ${formattedHours}:25 AM`);
  });

  it('should show 0 if minutes less than 10', (): void => {
    const result: string = pipe.transform(dateWhereMinutesLessThan10, 'en');
    const fullDate: Date = new Date(result);
    const hours: number = fullDate.getHours();
    const formattedHours: number = hours % 12 || 12;
    expect(result).toBe(`3 May 2024 ${formattedHours}:05 AM`);
  });
});
