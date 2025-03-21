import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isChecked: boolean = false;
  isSignupSuccessful: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  repeatedPassword: string = '';
  signupAttemptMade: boolean = false;
  nameRegex: RegExp = /^(?=.{3,})[A-Za-z0-9 ]+$/;
  emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!?&§@+\-\/\\]).+$/;

  router = inject(Router);

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  checkSignup(name: string, email: string, password: string, repeatedPassword: string): void {
    this.signupAttemptMade = true;
    this.isSignupSuccessful = this.testInputs(name, email, password, repeatedPassword);

    if(!this.isSignupSuccessful) return;
    
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }

  testInputs(name: string, email: string, password: string, repeatedPassword: string): boolean {
    return this.nameRegex.test(name) && 
    this.emailRegex.test(email) && 
    this.passwordRegex.test(password) &&
    repeatedPassword === password && 
    this.isChecked;
  }
}
