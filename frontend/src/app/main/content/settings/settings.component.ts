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
  constructor(private dialog: DialogService, public data: DataService, public language: LanguageService) { }

  deleteAccount(str: string): void {
    this.dialog.openConfirmationDialog(str);
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
