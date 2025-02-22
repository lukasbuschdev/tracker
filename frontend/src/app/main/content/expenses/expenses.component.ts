import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { Expense } from '../../../types/types';
import { UtilsService } from '../../../services/utils.service';

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
  currentAvailable: number = 2550;
  expenses: Expense[] = [
    {
      id: '0',
      name: 'Bus ticket',
      category: 'Transportation',
      amount: 5.20
    },
    {
      id: '1',
      name: 'Lunch',
      category: 'Food',
      amount: 12.70
    },
    {
      id: '2',
      name: 'Rent',
      category: 'Rent',
      amount: 720
    },
    {
      id: '3',
      name: 'Snack',
      category: 'Food',
      amount: 3.20
    },
    {
      id: '4',
      name: 'Train ticket',
      category: 'Transportation',
      amount: 6.80
    }
  ]

  constructor(private dialog: DialogService, public utils: UtilsService) { }

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

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
