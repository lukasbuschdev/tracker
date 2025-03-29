import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { UtilsService } from '../../services/utils.service';
import { typeUser } from '../../types/types';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { LanguageService } from '../../services/language.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, TranslatePipe],
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
  isAlreadyExistingUser: boolean = false;

  router = inject(Router);
  utils = inject(UtilsService);
  language = inject(LanguageService);
  http = inject(HttpClient);
  data = inject(DataService);

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  async checkSignup(name: string, email: string, password: string, repeatedPassword: string): Promise<void> {
    this.isAlreadyExistingUser = false;
    this.signupAttemptMade = true;

    // if(await this.checkIfUserAlreadyExists(email)) {
    //   this.isAlreadyExistingUser = true;
    //   return;
    // };

    this.isSignupSuccessful = this.testInputs(name, email, password, repeatedPassword);
    const hashedPassword = await this.utils.sha256(password);
    const verificationCode = this.utils.createVerificationCode();

    if(!this.isSignupSuccessful) return;

    const unverifiedUser = await User.create({
      name, 
      email, 
      password: hashedPassword,
      isVerified: false,
      verificationCode
    });

    this.saveUnverifiedUserToLocalStorage(unverifiedUser);

    this.sendMail(name, email, verificationCode);

    setTimeout(() => {
      this.router.navigateByUrl('/verification');
    }, 3000);
  }

  async checkIfUserAlreadyExists(email: string): Promise<boolean> {
    const user = await User.getUserWithEmail(email);
    return user ? true : false;
  }

  testInputs(name: string, email: string, password: string, repeatedPassword: string): boolean {
    return this.nameRegex.test(name) && 
    this.emailRegex.test(email) && 
    this.passwordRegex.test(password) &&
    repeatedPassword === password && 
    this.isChecked;
  }

  saveUnverifiedUserToLocalStorage(userData: typeUser): void {
    const unverifiedUser = {
      id: userData.id
    }
    
    localStorage.setItem('unverifiedUser', JSON.stringify(unverifiedUser));
  }

  sendMail(name: string, email: string, verificationCode: string): void {
    const lang = this.getCurrentLang();

    this.http.post('/api/send-mail', {
      to: email,
      name: name,
      email: email,
      url: `https://expensetracker.lukasbusch.dev/verification#${verificationCode}`,
      verificationCode: verificationCode,
      lang: lang
    }).subscribe(response => {
      console.log('Email send result: ', response);
    });
  }

  getCurrentLang(): string {
    return this.language.currentLanguage;
  }
}
