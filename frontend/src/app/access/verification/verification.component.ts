import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent implements OnInit {
  isVerified: boolean = false;
  isSuccessful: boolean = true;
  verificationAttemptMade: boolean = false;
  verificationCode: string = '';

  @ViewChild('code') code!: ElementRef<HTMLInputElement>;

  data = inject(DataService);
  router = inject(Router);

  ngOnInit(): void {
    this.verificationCode = window.location.hash.substring(1);
  }

  async checkVerification(code: string): Promise<void> {
    this.verificationAttemptMade = true;
    const unverifiedUserId = this.getUnverifiedUserFromLocalStorage();

    const user = await User.get(unverifiedUserId);
    if(!user) return;
    if(user.verificationCode !== code) {
      this.isSuccessful = false;
      return;
    }

    this.setVerificationSuccessful();

    await User.patch(user.id, { isVerified: true });

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }

  getUnverifiedUserFromLocalStorage(): string {
    const unverifiedUser = localStorage.getItem('unverifiedUser');
    if(!unverifiedUser) return '';
    
    const user = JSON.parse(unverifiedUser);

    return user.id;
  }

  setVerificationSuccessful(): void {
    this.isSuccessful = true;
    this.isVerified = true; 
  }
}
