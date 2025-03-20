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

  canActivate(): boolean {
    if(this.data.currentUser) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
