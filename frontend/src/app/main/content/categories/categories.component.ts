import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { Category } from '../../../models/category';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  isDropdownOpened: boolean = false;
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';
  availableInSelectedBudget: number = 0;

  constructor(public utils: UtilsService, private dialog: DialogService, public data: DataService) { }

  theme = inject(ThemeService);

  async ngOnInit(): Promise<void> {
    this.data.dataLoaded$.subscribe(async (loaded) => {
      if(loaded) return this.data.getCategories();
    });
  }

  toggleActiveCategory(event: MouseEvent, categoryId: string): void {
    event.stopPropagation();
    if(this.activeCategoryId === categoryId) return this.closeCategory();
    this.activeCategoryId = categoryId;
    this.data.clickedCategory = this.data.categoriesArray.filter(category => category.id === this.activeCategoryId)[0];
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

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }

  calculateAvailableBudget(): number {
    if(!this.data.selectedBudget) return 0;

    const categoriesAmounts = this.data.categoriesArray.map(category => category.amount);

    return this.availableInSelectedBudget = this.data.selectedBudget?.amount - categoriesAmounts.reduce((acc, curr) => acc + curr, 0);
  }

  calculateCategoryUsed(category: Category): number {
    const expenses = this.data.expensesArray.filter(expense => expense.category === category.name);
    const expensesAmount = expenses.map(expense => expense?.amount);
    const categoryAmountUsed = expensesAmount.reduce((acc, curr) => acc + curr, 0);

    return categoryAmountUsed;
  }
}
