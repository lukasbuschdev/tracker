import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  router = inject(Router);

  setNavigation(link: string, delay: number) {
    setTimeout(() => {
      this.router.navigateByUrl(link);
    }, delay);
  }
}
