import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { typeUser } from '../../types/types';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';
import { UtilsService } from '../../services/utils.service';
import { NavigationService } from '../../services/navigation.service';

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
  isNotExisting: boolean = false;

  @ViewChild('email') email!: ElementRef<HTMLInputElement>; 

  language = inject(LanguageService);
  http = inject(HttpClient);
  data = inject(DataService);
  utils = inject(UtilsService);
  navigation = inject(NavigationService);

  async checkReset(email: string): Promise<void> {
    this.resetAttemptMade = true;
    const verificationCode = this.utils.createVerificationCode();

    if(!this.emailRegex.test(email)) return;

    const user = await this.getUser(email);
    if(!user) return;

    await this.updateUser(user, verificationCode);

    this.sendMail(user.name, user.email, verificationCode, user.id);
    this.resetMailSent = true;
    this.navigation.setNavigation('/reset-password', 3000);
  }

  async getUser(email: string): Promise<User | void> {
    try {
      const user = await User.getUserWithEmail(email);
      this.isNotExisting = false;
      return user;
    } catch (error) {
      this.isNotExisting = true;
      console.error('Email does not exist!', error); 
    }
  }

  sendMail(name: string, email: string, verificationCode: string, userId: string): void {
    const lang = this.getCurrentLang();

    this.http.post('/api/send-reset-mail', {
      to: email,
      name: name,
      email: email,
      url: `https://expensetracker.lukasbusch.dev/reset-password?verificationCode=${verificationCode}&userId=${userId}`,
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
