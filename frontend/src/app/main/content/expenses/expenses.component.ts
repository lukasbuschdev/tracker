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
}
