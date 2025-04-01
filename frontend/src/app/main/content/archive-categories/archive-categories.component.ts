import { Component, inject } from '@angular/core';
import { Category } from '../../../models/category';
import { ThemeService } from '../../../services/theme.service';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-archive-categories',
  imports: [TranslatePipe, CommonModule, RouterLink],
  templateUrl: './archive-categories.component.html',
  styleUrl: './archive-categories.component.scss'
})
export class ArchiveCategoriesComponent {
  isDropdownOpened: boolean = false;
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';
  availableInSelectedBudget: number = 0;

  constructor(public utils: UtilsService, public data: DataService) { }

  theme = inject(ThemeService);
  router = inject(Router);

  toggleActiveCategory(event: MouseEvent, categoryId: string): void {
    event.stopPropagation();
    if(this.activeCategoryId === categoryId) return this.closeCategory();
    this.activeCategoryId = categoryId;
    this.data.clickedCategory = this.data.archivedCategoriesOfClickedBudget.filter(category => category.id === this.activeCategoryId)[0];
  }

  closeCategory(): void {
    this.activeCategoryId = '';
  }

  editCategory(event: MouseEvent): void {
    event.stopPropagation();
  }

  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeBudgtes(): void {
    this.isDropdownOpened = false;
  }

  calculateAvailableBudget(): number {
    if(!this.data.clickedBudget) return 0;

    const categoriesAmounts = this.data.archivedCategoriesOfClickedBudget.map(category => category.amount);

    return this.availableInSelectedBudget = this.data.clickedBudget.amount - categoriesAmounts.reduce((acc, curr) => acc + curr, 0);
  }

  calculateCategoryUsed(category: Category): number {
    const expenses = this.data.archivedExpensesOfClickedBudget.filter(expense => expense.category === category.name);
    const expensesAmount = expenses.map(expense => expense?.amount);
    const categoryAmountUsed = expensesAmount.reduce((acc, curr) => acc + curr, 0);

    return categoryAmountUsed;
  }
}
