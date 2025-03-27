import { Component } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { Budget } from '../../../models/budget';
import { TranslatePipe } from '../../../pipe/translate.pipe';

@Component({
  selector: 'app-expenses',
  imports: [TranslatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  isFilterVisible: boolean = false;
  isDropdownOpened: boolean = false;
  selectedExpenseId: string = '';
  isNamesAscending: boolean = false;
  isCategoriesAscending: boolean = false;
  isAmountAscending: boolean = false;

  constructor(private dialog: DialogService, public utils: UtilsService, public data: DataService) { }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeBudgtes(): void {
    this.isDropdownOpened = false;
  }

  openDialog(str: string, expenseId?: string, category?: string): void {
    this.dialog.openDialog(str, category);

    if(!expenseId) return;

    this.selectedExpenseId = expenseId; 
    this.data.clickedExpense = this.data.expensesArray.find(expense => expense.id === this.selectedExpenseId) ?? null;
  }

  sortExpensesByName(): void {
    this.data.expensesArray.sort((a, b) => {
      return this.isNamesAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    });

    this.isNamesAscending = !this.isNamesAscending;
  }
  
  sortExpensesByCategory(): void {
    this.data.expensesArray.sort((a, b) => {
      return this.isCategoriesAscending ? b.category.localeCompare(a.category) : a.category.localeCompare(b.category);
    });


    this.isCategoriesAscending = !this.isCategoriesAscending;
  }
  
  sortExpensesByAmount(): void {
    this.data.expensesArray.sort((a, b) => {
      return this.isAmountAscending ? a.amount - b.amount : b.amount - a.amount; 
    });

    this.isAmountAscending = !this.isAmountAscending;
  }
}
