import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading: boolean = false;

  constructor() { }

  loadingAnimation(duration: number): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
    }, duration);
  }
}
