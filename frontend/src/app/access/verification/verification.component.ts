import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  imports: [TranslatePipe],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent {
  isVerified: boolean = false;
  isSuccessful: boolean = false;
  verificationAttemptMade: boolean = false;

  @ViewChild('code') code!: ElementRef<HTMLInputElement>;

  data = inject(DataService);
  router = inject(Router);

  async checkVerification(code: string): Promise<void> {
    this.verificationAttemptMade = true;
    const unverifiedUserId = this.getUnverifiedUserFromLocalStorage();

    const user = await User.get(unverifiedUserId);
    if(!user) return;
    if(user.verificationCode !== code) return;

    this.setVerificationSuccessful();

    await User.patch(user.id, { isVerified: true });

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 1500);
  }

  getUnverifiedUserFromLocalStorage(): string {
    const unverifiedUser = localStorage.getItem('unverifiedUser');
    if(!unverifiedUser) return '';
    
    const user= JSON.parse(unverifiedUser);

    return user.id;
  }

  setVerificationSuccessful(): void {
    this.isSuccessful = true;
    this.isVerified = true; 
  }
}
