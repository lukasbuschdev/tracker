import { Component } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isDropdownOpened: boolean = false;
  selectableLanguages: string[] = ['English', 'Español', 'Deutsch', 'Français', 'Italiano'];
  selectedLanguage: string = 'English';

  constructor(private dialog: DialogService, public data: DataService, private language: LanguageService) { }

  toggleLanguages(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeLanguages(): void {
    this.isDropdownOpened = false;
  }

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    if(language === 'English') return this.language.changeLanguage('en');
    if(language === 'Español') return this.language.changeLanguage('es');
    this.language.changeLanguage('de');
  }

  deleteAccount(str: string): void {
    this.dialog.openConfirmationDialog(str);
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
