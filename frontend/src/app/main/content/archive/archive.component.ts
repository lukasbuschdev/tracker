import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { DialogService } from '../../../services/dialog.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';

  data = inject(DataService);
  utils = inject(UtilsService);
  theme = inject(ThemeService);
  language = inject(LanguageService);
  router = inject(Router);


  toggleActiveBudget(event: MouseEvent, budgetId: string): void {
    event.stopPropagation();
    if(this.activeBudgetId === budgetId) return this.closeBudget();
    this.activeBudgetId = budgetId;
    this.data.clickedBudget = this.data.archivedBudgetsArray.filter(budget => budget.id === this.activeBudgetId)[0];
    this.data.archivedCategoriesOfClickedBudget = this.data.archivedCategoriesArray.filter(category => category.budgetId === this.data.clickedBudget?.id);
    this.data.archivedExpensesOfClickedBudget = this.data.archivedExpensesArray.filter(expense => expense.budgetId === this.data.clickedBudget?.id);
  }

  closeBudget(): void {
    this.activeBudgetId = '';
  }

  getArchivedCategories(): void {
    this.router.navigateByUrl('/archive-categories');
  }
  
  getArchivedExpenses(): void {
    this.router.navigateByUrl('/archive-expenses');
  }
}
