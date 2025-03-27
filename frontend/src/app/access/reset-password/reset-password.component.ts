import { Component, Inject, inject } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { typeUser } from '../../types/types';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-reset-password',
  imports: [TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  isResetSuccessful: boolean = false;
  resetAttemptMade: boolean = false;
  isVaildVerificationCode: boolean = true;
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!?&§@+\-\/\\]).+$/;

  router = inject(Router);
  utils = inject(UtilsService);

  async checkReset(code: string, password: string, repeatedPassword: string): Promise<void> {
    this.resetAttemptMade = true;
    const user = await this.getResetUser();
    if(!user) return;

    this.isResetSuccessful = this.testInputs(code, password, repeatedPassword, user.verificationCode);
    this.updateUser(user.id, password);

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }

  async getResetUser(): Promise<typeUser | undefined>{
    const resetUser = localStorage.getItem('resetUser');
    if(!resetUser) return undefined;
    
    const userData = JSON.parse(resetUser);
    const user = await User.get(userData.id);
    if(!user) return undefined;

    return user;
  }

  testInputs(code: string, password: string, repeatedPassword: string, verificationCode: string): boolean {
    if(code !== verificationCode) {
      this.isVaildVerificationCode = false;
    }
    
    return code === verificationCode && 
    this.passwordRegex.test(password) &&
    repeatedPassword === password
  }

  setVerificationSuccessful(): void {
    this.isResetSuccessful = true;
  }

  async updateUser(userId: string, password: string): Promise<void> {
    const hashedPassword =  await this.utils.sha256(password);

    const updateData = {
      password: hashedPassword
    }

    await User.patch(userId, updateData);
  }
}
