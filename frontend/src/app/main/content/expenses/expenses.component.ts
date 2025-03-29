import { Component, inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-expenses',
  imports: [TranslatePipe, FormsModule, DatePipe, CommonModule],
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
  timer!: any;
  filterInputValue: string = '';

  constructor(private dialog: DialogService, public utils: UtilsService, public data: DataService) { }

  theme = inject(ThemeService);

  ngOnInit(): void {
    this.data.filteredExpenses = this.data.expensesArray;
    this.isFilterVisible = false;
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.resetFilterInputValue();
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
    this.resetFilterInputValue();

    if(!expenseId) return;

    this.selectedExpenseId = expenseId; 
    this.data.clickedExpense = this.data.expensesArray.find(expense => expense.id === this.selectedExpenseId) ?? null;
  }

  sortExpensesByName(): void {
    this.data.filteredExpenses.sort((a, b) => {
      return this.isNamesAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    });

    this.isNamesAscending = !this.isNamesAscending;
  }
  
  sortExpensesByCategory(): void {
    this.data.filteredExpenses.sort((a, b) => {
      return this.isCategoriesAscending ? b.category.localeCompare(a.category) : a.category.localeCompare(b.category);
    });


    this.isCategoriesAscending = !this.isCategoriesAscending;
  }
  
  sortExpensesByAmount(): void {
    this.data.filteredExpenses.sort((a, b) => {
      return this.isAmountAscending ? a.amount - b.amount : b.amount - a.amount; 
    });

    this.isAmountAscending = !this.isAmountAscending;
  }

  getInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.search(input.value);
    }, 300);
  }

  search(input: string): void {
    if(input.trim()) {
      this.data.filteredExpenses = this.data.filteredExpenses.filter(expense => {
        const formattedDate = new Date(expense.created).toLocaleString().toLowerCase();

        return expense.name.toLowerCase().includes(input.toLowerCase()) || 
              expense.category.toLowerCase().includes(input.toLowerCase()) || 
              expense.amount === Number(input) ||
              formattedDate.includes(input.toLowerCase());
      });
    } else {
      this.data.filteredExpenses = this.data.expensesArray
    }
  }
  
  resetFilterInputValue(): void {
    this.filterInputValue = '';
  }

  calculateCurrentBudgetSum(): number {
    const expensesAmount = this.data.filteredExpenses.map(expense => expense.amount).reduce((acc, curr) => acc + curr, 0); 
    return expensesAmount;
  }
}
