import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformFavoriteDate',
  standalone: true,
  pure: true,
})
export class TransformFavoriteDatePipe implements PipeTransform {
  transform(value: string): string {
    const fullDate: Date = new Date(value);
    const date: number = fullDate.getDate();
    const month: string = fullDate.toLocaleDateString('en-US', { month: 'short' });
    const year: number = fullDate.getFullYear();
    const hours: number = fullDate.getHours();
    const minutes: number = fullDate.getMinutes();
    const amOrPm: string = hours > 12 ? 'PM' : 'AM';
    const formattedHours: number = hours % 12 || 12;
    const formattedMinutes: string = minutes < 10 ? `0${minutes}` : minutes.toString();
    return `${date} ${month} ${year} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }
}
