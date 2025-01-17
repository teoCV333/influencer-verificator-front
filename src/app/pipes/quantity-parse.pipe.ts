import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantityParse',
  standalone: true
})
export class QuantityParsePipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M+';
  } else if (value >= 1000) {
      return (value / 1000).toFixed() + 'K+';
  } else {
      return value.toString();
  }
  }

}
