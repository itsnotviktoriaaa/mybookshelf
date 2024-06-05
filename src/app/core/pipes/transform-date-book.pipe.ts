import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateBook',
  standalone: true,
})
export class TransformDateBookPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    if (value.length > 4) {
      return value.slice(0, 4);
    }
    return value;
  }
}
