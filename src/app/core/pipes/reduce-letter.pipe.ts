import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceLetter',
  standalone: true,
  pure: true,
})
export class ReduceLetterPipe implements PipeTransform {
  quantityPossibleLetter: number = 0;
  constructor() {}
  transform(value: string, className: 'book-name' | 'book-author' | 'author'): string {
    if (!value) return value;
    if (className === 'book-name') {
      this.quantityPossibleLetter = 15;
    } else if (className === 'book-author') {
      this.quantityPossibleLetter = 17;
    } else if (className === 'author') {
      this.quantityPossibleLetter = 280;
    }

    if (value.length > this.quantityPossibleLetter) {
      return value.slice(0, this.quantityPossibleLetter++) + '...';
    }
    return value;
  }
}
