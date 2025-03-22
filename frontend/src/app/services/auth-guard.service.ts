import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  existsCurrentUser: boolean = false;

  constructor() { }

  router = inject(Router);
  data = inject(DataService);

  async canActivate(): Promise<boolean> {
    await this.data.getLoggedUserFromLocalStorage();

    if(this.data.currentUser && this.data.isLoggedIn) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
