import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  isResetSuccessful: boolean = false;
  resetAttemptMade: boolean = false;
  isVaildVerificationCode: boolean = true;
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!?&§@+\-\/\\]).+$/;
  verificationCode: string = '';
  userId: string = '';

  utils = inject(UtilsService);
  navigation = inject(NavigationService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.verificationCode = this.route.snapshot.queryParamMap.get('verificationCode') || '';
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
  }

  async checkReset(code: string, password: string, repeatedPassword: string): Promise<void> {
    this.resetAttemptMade = true;
    const user = await User.get(this.userId);
    if(!user) return;

    this.isResetSuccessful = this.testInputs(code, password, repeatedPassword, user.verificationCode);
    this.updateUser(user.id, password);
    this.navigation.setNavigation('/login', 3000);
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
