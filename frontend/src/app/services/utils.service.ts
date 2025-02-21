import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() { }

  checkNumber(num: number): string {
    return num > 0 ? '+' : '-';
  }

  formatNumber(num: number): string {
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
