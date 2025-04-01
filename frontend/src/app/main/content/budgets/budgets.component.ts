import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, TranslatePipe, DatePipe],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';

  constructor(public utils: UtilsService, private dialog: DialogService, public data: DataService) { }

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
