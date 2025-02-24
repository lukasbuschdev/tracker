import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-budgets',
  imports: [],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';

  constructor(public utils: UtilsService, private dialog: DialogService, public data: DataService) { }

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

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
