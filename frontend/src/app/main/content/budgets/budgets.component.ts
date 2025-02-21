import { Component } from '@angular/core';
import { BudgetOrCategory } from '../../../types/types';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-budgets',
  imports: [],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';
  budgets: BudgetOrCategory[] = [
    {
      id: '0',
      name: "Income",
      generalAvailable: 3270.00,
      used: 760.00,
      currentAvailable: 2550.00
    },
    {
      id: '1',
      name: "Savings",
      generalAvailable: 13270.00,
      used: 1760.00,
      currentAvailable: 12550.00
    }
  ];

  constructor(public utils: UtilsService) { }

  toggleActiveBudget(event: MouseEvent, budgetId: string): void {
    event.stopPropagation();
    if(this.activeBudgetId === budgetId) return this.closeBudget();
    this.activeBudgetId = budgetId;
  }

  closeBudget(): void {
    this.activeBudgetId = '';
  }

  editBudget(event: MouseEvent): void {
    event.stopPropagation();
  }
}
