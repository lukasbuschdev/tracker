import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { LoadingService } from '../../services/loading.service';
import { NavigationService } from '../../services/navigation.service';
import { typeUser } from '../../types/types';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, TranslatePipe],
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

  constructor(private utils: UtilsService, private data: DataService, public loading: LoadingService) { }

  navigation = inject(NavigationService);

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
      this.loading.loadingAnimation(1500);
      const user = await User.getUserWithEmailOrNameAndPassword(emailOrName, hashedPassword);

      if(!user.isVerified) return;
      this.setLoginData(user);

      if(this.isChecked && emailOrName !== 'Guest') {
        this.saveCredentialsToLocalStorage(emailOrName, password);
      }

      this.saveLoggedUserToLocalStorage(user.id);
      await this.data.init();
      this.navigation.setNavigation('/dashboard', 0);
    } catch (error) {
      console.error(error);
      this.resetBooleans();
    }

    this.resetInputs();
  }

  saveCredentialsToLocalStorage(emailOrName: string, password: string): void {
    const remeberMeUser = {
      emailOrName: emailOrName,
      password: password,
      isChecked: this.isChecked,
      isLoggedIn: this.data.isLoggedIn
    }

    localStorage.setItem('remeberMeUser', JSON.stringify(remeberMeUser));
  }

  getCredentialsFromLocalStorage(): void {
    const storedUserString = localStorage.getItem('remeberMeUser');
    if(!storedUserString) return;
    this.existsStoredUser = true;
    
    const remeberMeUser = JSON.parse(storedUserString);

    this.emailOrName = remeberMeUser.emailOrName;
    this.password = remeberMeUser.password;
    this.isChecked = remeberMeUser.isChecked;
    this.data.isLoggedIn = remeberMeUser.isLoggedIn;
  }

  saveLoggedUserToLocalStorage(id: string): void {
    const loggedUser = {
      id: id,
      isLoggedIn: this.data.isLoggedIn
    }

    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  }

  setLoginData(user: typeUser): void {
    this.data.isLoggedIn = true;
    this.data.currentUser = user;
    this.data.currentUserId = user.id;
  }

  resetBooleans(): void {
    this.isUserFound = false;
    this.isChecked = false;
    this.data.isLoggedIn = false;
  }

  resetInputs(): void {
    this.emailOrName = '';
    this.password = '';
  }
}
