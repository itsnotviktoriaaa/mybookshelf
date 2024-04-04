import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateBook',
  standalone: true,
})
export class TransformDateBookPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    if (value.length > 4) {
      return value.slice(0, 4);
    }
    return value;
  }
}
