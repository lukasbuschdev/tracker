import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isDropdownOpened: boolean = false;
  selectableLanguages: string[] = ['English', 'Español', 'Deutsch'];
  selectedLanguage: string = 'English';

  toggleLanguages(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeLanguages(): void {
    this.isDropdownOpened = false;
  }

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
  }
}
