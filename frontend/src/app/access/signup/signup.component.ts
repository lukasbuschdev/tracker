import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isChecked: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  repeatedPassword: string = '';
  signupAttemptMade: boolean = false;
  nameRegex: RegExp = /^(?=.{4,})[A-Za-z0-9 ]+$/;
  emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!?&§@+\-\/\\]).+$/;

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  checkSignup(name: string, email: string, password: string, repeatedPassword: string): void {
    this.signupAttemptMade = true;
    const isCorrectInput = this.testInputs(name, email, password, repeatedPassword);

    if(!isCorrectInput) return;

    
  }

  testInputs(name: string, email: string, password: string, repeatedPassword: string): boolean {
    return this.nameRegex.test(name) && 
    this.emailRegex.test(email) && 
    this.passwordRegex.test(password) &&
    repeatedPassword === password && 
    this.isChecked ? true : false;
  }
}
