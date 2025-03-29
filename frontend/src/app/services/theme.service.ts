import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkmode: boolean = false;

  constructor() { }

  loadTheme(): void {
    setTimeout(() => {
      const stored = localStorage.getItem('isDarkmode');
      if (stored !== null) {
        this.isDarkmode = stored === 'true';
      }
    });
  }

  toggleThemeMode(): void {
    this.isDarkmode = !this.isDarkmode;
    localStorage.setItem('isDarkmode', String(this.isDarkmode));
  }
}
