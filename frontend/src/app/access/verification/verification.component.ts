import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';

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
  unverifiedUserId: string = '';

  @ViewChild('code') code!: ElementRef<HTMLInputElement>;

  data = inject(DataService);
  navigation = inject(NavigationService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.verificationCode = this.route.snapshot.queryParamMap.get('verificationCode') || '';
    this.unverifiedUserId = this.route.snapshot.queryParamMap.get('userId') || '';
  }

  async checkVerification(code: string): Promise<void> {
    this.verificationAttemptMade = true;
    const user = await User.get(this.unverifiedUserId);

    if(!user) return;
    if(user.verificationCode !== code) {
      this.isSuccessful = false;
      return;
    }

    this.setVerificationSuccessful();
    await User.patch(user.id, { isVerified: true });
    this.navigation.setNavigation('/login', 3000);
  }

  setVerificationSuccessful(): void {
    this.isSuccessful = true;
    this.isVerified = true; 
  }
}
