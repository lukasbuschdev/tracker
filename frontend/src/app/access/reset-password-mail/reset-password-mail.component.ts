import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { typeUser } from '../../types/types';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-reset-password',
  imports: [TranslatePipe],
  templateUrl: './reset-password-mail.component.html',
  styleUrl: './reset-password-mail.component.scss'
})
export class ResetPasswordMailComponent {
  resetAttemptMade: boolean = false;
  emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  resetMailSent: boolean = false;
  isInvalidEmail: boolean = false;

  @ViewChild('email') email!: ElementRef<HTMLInputElement>; 

  router = inject(Router);
  language = inject(LanguageService);
  http = inject(HttpClient);
  data = inject(DataService);
  utils = inject(UtilsService);

  async checkReset(email: string): Promise<void> {
    this.resetAttemptMade = true;
    const verificationCode = this.utils.createVerificationCode();

    if(!this.emailRegex.test(email)) return;

    const user = await this.getUser(email);
    if(!user) return;

    this.saveUserToLocalStorage(user);
    await this.updateUser(user, verificationCode);

    this.sendMail(user.name, user.email, verificationCode);
    this.resetMailSent = true;
    
    setTimeout(() => {
      this.router.navigateByUrl('/reset-password');
    }, 3000);
  }

  async getUser(email: string): Promise<User | undefined> {
    const user = await User.getUserWithEmail(email);

    if(!user) {
      this.isInvalidEmail = true;
      return undefined;
    };

    return user;
  }

  saveUserToLocalStorage(userData: typeUser): void {
    console.log(userData)
    const resetUser = {
      id: userData.id
    }
    
    localStorage.setItem('resetUser', JSON.stringify(resetUser));
  }

  sendMail(name: string, email: string, verificationCode: string): void {
    const lang = this.getCurrentLang();

    this.http.post('/api/send-reset-mail', {
      to: email,
      name: name,
      email: email,
      url: 'https://expensetracker.lukasbusch.dev/reset-password',
      verificationCode: verificationCode,
      lang: lang
    }).subscribe(response => {
      console.log('Email send result: ', response);
    });
  }

  getCurrentLang(): string {
    return this.language.currentLanguage;
  }

  async updateUser(user: typeUser, verificationCode: string): Promise<void> {
    const updateData = {
      verificationCode: verificationCode
    }

    await User.patch(user.id, updateData);
  }
}
