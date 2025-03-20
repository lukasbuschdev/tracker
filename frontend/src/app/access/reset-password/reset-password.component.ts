import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetAttemptMade: boolean = false;
  emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  resetMailSent: boolean = false;

  @ViewChild('email') email!: ElementRef<HTMLInputElement>; 

  checkReset(email: string): void {
    this.resetAttemptMade = true;
    if(!this.emailRegex.test(email)) return;
    
    this.resetMailSent = true;
    console.log('Reset request made!')
  }
}
