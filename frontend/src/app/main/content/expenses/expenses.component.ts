import { Component, inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';
import { typeBudget } from '../../../types/types';

@Component({
  selector: 'app-expenses',
  imports: [TranslatePipe, FormsModule, DatePipe, CommonModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  isFilterVisible: boolean = false;
  isBudgetsDropdownOpened: boolean = false;
  isMonthsDropdownOpened: boolean = false;
  isCategoriesDropdownOpened: boolean = false;
  selectedExpenseId: string = '';
  isNamesAscending: boolean = false;
  isCategoriesAscending: boolean = false;
  isAmountAscending: boolean = false;
  timer!: any;
  filterInputValue: string = '';
  months: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  selectedMonth: string = '';
  selectedCategory: string = '';
  isFilterActive: boolean = false;

  constructor(private dialog: DialogService, public utils: UtilsService, public data: DataService) { }

  theme = inject(ThemeService);
  language = inject(LanguageService);

  ngOnInit(): void {
    this.data.filteredExpenses = this.data.expensesArray;
    this.isFilterVisible = false;
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.resetFilter();
    this.closeBudgtes();
  }

  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isBudgetsDropdownOpened = !this.isBudgetsDropdownOpened;
  }

  toggleMonths(event: MouseEvent): void {
    event.stopPropagation();
    this.isMonthsDropdownOpened = !this.isMonthsDropdownOpened;
    this.closeBudgtes();
    this.closeCategories();
  }

  toggleCategories(event: MouseEvent): void {
    event.stopPropagation();
    this.isCategoriesDropdownOpened = !this.isCategoriesDropdownOpened;
    this.closeBudgtes();
    this.closeMonths();
  }

  resetFilter(): void {
    this.resetFilterInputValue();
    this.resetDropdownFilter();
  }

  resetDropdownFilter(): void {
    this.selectedMonth = '';
    this.selectedCategory = '';
    this.data.filteredExpenses = this.data.expensesArray;
    this.isFilterActive = false;
  }

  resetFilterInputValue(): void {
    this.filterInputValue = '';
    this.isFilterActive = false;
  }

  closeFilter(): void {
    this.isFilterVisible = false;
    this.resetDropdownFilter();
  }

  closeBudgtes(): void {
    this.isBudgetsDropdownOpened = false;
  }

  closeMonths(): void {
    this.isMonthsDropdownOpened = false;
  }

  closeCategories(): void {
    this.isCategoriesDropdownOpened = false;
  }

  selectBudget(budget: typeBudget): void {
    this.data.selectBudget(budget);
    this.closeFilter();
  }

  selectMonth(month: string): void {
    this.resetFilterInputValue();
    this.selectedMonth = month;
    this.isFilterActive = true;
    this.setFilter();
  }

  selectCategory(category: string): void {
    this.resetFilterInputValue();
    this.selectedCategory = category;
    this.isFilterActive = true;
    this.setFilter();
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
    this.resetDropdownFilter();
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

  calculateCurrentBudgetSum(): number {
    const expensesAmount = this.data.filteredExpenses.map(expense => expense.amount).reduce((acc, curr) => acc + curr, 0); 
    return expensesAmount;
  }

  setFilter(): void {
    this.data.filteredExpenses = this.data.expensesArray;
    const selectedMonthNumber = this.selectedMonth ? parseInt(this.selectedMonth, 10) - 1 : null;
  
    this.data.filteredExpenses = this.data.filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.created);
  
      const matchesMonth = selectedMonthNumber !== null ? expenseDate.getMonth() === selectedMonthNumber : true;
      const matchesCategory = this.selectedCategory ? expense.category === this.selectedCategory : true;
  
      return matchesMonth && matchesCategory;
    });
  }  
}
