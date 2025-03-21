import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isChecked: boolean = false;
  emailOrName: string = '';
  password: string = '';
  isUserFound: boolean = false;
  loginAttempted: boolean = false;
  existsStoredUser: boolean = false;

  constructor(private utils: UtilsService, private data: DataService) { }

  router = inject(Router);

  ngOnInit(): void {
    this.getCredentialsFromLocalStorage();
  }

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  async checkLogin(emailOrName: string, password: string): Promise<void> {
    const hashedPassword = await this.utils.sha256(password);
    this.loginAttempted = true;
    this.isUserFound = true;
    
    try {
      const user = await User.getUserWithEmailOrNameAndPassword(emailOrName, hashedPassword);

      if(this.isChecked && emailOrName !== 'Guest') {
        this.saveCredentialsToLocalStorage(emailOrName, password);
      }

      this.data.currentUser = user;
      this.data.currentUserId = user.id;
      await this.data.init();
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error(error)
      this.isUserFound = false;
      this.isChecked = false;
    }

    this.emailOrName = '';
    this.password = '';
  }

  saveCredentialsToLocalStorage(emailOrName: string, password: string): void {
    const user = {
      emailOrName: emailOrName,
      password: password,
      isChecked: this.isChecked
    }

    localStorage.setItem('user', JSON.stringify(user));
  }

  getCredentialsFromLocalStorage(): void {
    const storedUserString = localStorage.getItem('user');
    if(!storedUserString) return;
    this.existsStoredUser = true;
    
    const user = JSON.parse(storedUserString);

    this.emailOrName = user.emailOrName;
    this.password = user.password;
    this.isChecked = user.isChecked;
  }
}
