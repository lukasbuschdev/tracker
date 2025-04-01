import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { DialogService } from '../../../services/dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-archive',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';

  constructor(private dialog: DialogService) { }

  data = inject(DataService);
  utils = inject(UtilsService);
  theme = inject(ThemeService);
  language = inject(LanguageService);

  toggleActiveBudget(event: MouseEvent, budgetId: string): void {
    event.stopPropagation();
    if(this.activeBudgetId === budgetId) return this.closeBudget();
    this.activeBudgetId = budgetId;
    this.data.clickedBudget = this.data.budgetsArray.filter(budget => budget.id === this.activeBudgetId)[0];
  }

  closeBudget(): void {
    this.activeBudgetId = '';
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
