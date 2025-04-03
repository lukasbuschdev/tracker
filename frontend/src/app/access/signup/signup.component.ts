import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { UtilsService } from '../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service';
import { DataService } from '../../services/data.service';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';

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
  nameRegex: RegExp = /^(?=.{3,})(?=.*[A-Za-z])[A-Za-z0-9 ]+$/;
  emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!?&§@+\-\/\\]).+$/;
  isAlreadyExistingUser: boolean = false;

  router = inject(Router);
  utils = inject(UtilsService);
  language = inject(LanguageService);
  http = inject(HttpClient);
  data = inject(DataService);
  navigation = inject(NavigationService);
  theme = inject(ThemeService);

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  async checkSignup(name: string, email: string, password: string, repeatedPassword: string): Promise<boolean | void> {
    this.isAlreadyExistingUser = false;
    this.signupAttemptMade = true;

    if(await this.checkIfUserAlreadyExists(email)) return this.isAlreadyExistingUser = true;

    this.isSignupSuccessful = this.testInputs(name, email, password, repeatedPassword);
    const hashedPassword = await this.utils.sha256(password);
    const verificationCode = this.utils.createVerificationCode();

    if(!this.isSignupSuccessful) return;
    this.data.isLoading = true;

    const unverifiedUser = await User.create({
      name, 
      email, 
      password: hashedPassword,
      isVerified: false,
      verificationCode
    });

    this.sendMail(name, email, verificationCode, unverifiedUser.id);
    this.navigation.setNavigation(`/verification?userId=${unverifiedUser.id}`, 3000);
  }

  async checkIfUserAlreadyExists(email: string): Promise<boolean> {
    try {
      const user = await User.getUserWithEmail(email);
      return user ? true : false; 
    } catch (error) {
      return false;
    }
  }

  testInputs(name: string, email: string, password: string, repeatedPassword: string): boolean {
    return this.nameRegex.test(name) && 
    this.emailRegex.test(email) && 
    this.passwordRegex.test(password) &&
    repeatedPassword === password && 
    this.isChecked;
  }

  sendMail(name: string, email: string, verificationCode: string, userId: string): void {
    const lang = this.getCurrentLang();

    this.http.post('/api/send-mail', {
      to: email,
      name: name,
      email: email,
      url: `https://expensetracker.lukasbusch.dev/verification?verificationCode=${verificationCode}&userId=${userId}`,
      verificationCode: verificationCode,
      lang: lang
    }).subscribe();
  }

  getCurrentLang(): string {
    return this.language.currentLanguage;
  }
}
