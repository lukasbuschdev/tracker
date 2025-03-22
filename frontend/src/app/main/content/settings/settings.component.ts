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

  constructor(private dialog: DialogService, public data: DataService, public language: LanguageService) { }

  toggleLanguages(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeLanguages(): void {
    this.isDropdownOpened = false;
  }

  selectLanguage(language: string): void {
    this.language.selectedLanguage = language;
    if(language === 'English') return this.language.changeLanguage('en');
    if(language === 'Español') return this.language.changeLanguage('es');
    if(language === 'Français') return this.language.changeLanguage('fr');
    if(language === 'Italiano') return this.language.changeLanguage('it');
    this.language.changeLanguage('de');
  }

  deleteAccount(str: string): void {
    this.dialog.openConfirmationDialog(str);
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
