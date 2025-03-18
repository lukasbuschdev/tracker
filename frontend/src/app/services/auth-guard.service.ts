import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor() { }

  router = inject(Router);

  canActivate(): boolean {
    this.router.navigateByUrl('/login')
    return false;
  }
}
