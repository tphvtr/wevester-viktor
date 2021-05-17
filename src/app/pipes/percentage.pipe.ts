import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'percentage'})

export class PercentagePipe implements PipeTransform {
  transform(value: number, stockPrice: number, totalPrice: number): number {
    return +((value * stockPrice * 100) / totalPrice).toFixed(2);
  }
}
