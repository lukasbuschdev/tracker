import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { User } from '../../models/user';
import { DataService } from '../../services/data.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { NavigationService } from '../../services/navigation.service';
import { typeUser } from '../../types/types';
import { ThemeService } from '../../services/theme.service';

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

  constructor(private utils: UtilsService) { }

  navigation = inject(NavigationService);
  theme = inject(ThemeService);
  data = inject(DataService);

  ngOnInit(): void {
    this.getCredentialsFromLocalStorage();
    this.data.isLoading = false;
  }

  toggleIsChecked() {
    this.isChecked = !this.isChecked;
  }

  async checkLogin(emailOrName: string, password: string): Promise<void> {
    const hashedPassword = await this.utils.sha256(password);
    this.loginAttempted = true;
    this.isUserFound = true;
    
    try {
      this.data.isLoading = true;
      const user = await User.getUserWithEmailOrNameAndPassword(emailOrName, hashedPassword);

      if(!user.isVerified) return;
      this.setLoginData(user);

      if(this.isChecked && emailOrName !== 'Guest') {
        this.saveCredentialsToLocalStorage(emailOrName, password);
      }

      this.saveLoggedUserToLocalStorage(user.id);
      this.navigation.setNavigation('/dashboard', 0);
      this.theme.loadTheme();
    } catch (error) {
      this.resetBooleans();
      this.data.isLoading = false;
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
