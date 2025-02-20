import { Component } from '@angular/core';

@Component({
  selector: 'app-expenses',
  imports: [],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  isFilterVisible: boolean = false;
  isDropdownOpened: boolean = false;
  selectableBudgets: string[] = ['Income', 'Savings', 'Whatever'];
  selectedBudget: string = 'Income';

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

  selectBudget(budget: string): void {
    this.selectedBudget = budget;
  }
}
