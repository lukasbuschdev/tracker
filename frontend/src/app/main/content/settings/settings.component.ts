import { Component } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';

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

  constructor(private dialog: DialogService, public data: DataService) { }

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

  deleteAccount(str: string): void {
    this.dialog.openConfirmationDialog(str);
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
