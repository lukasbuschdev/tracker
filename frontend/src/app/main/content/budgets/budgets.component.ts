import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { Budget } from '../../../models/budget';
import { TranslatePipe } from '../../../pipe/translate.pipe';

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, TranslatePipe],
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
    this.data.clickedBudget = this.data.budgetsArray.filter(budget => budget.id === this.activeBudgetId)[0];
  }

  closeBudget(): void {
    this.activeBudgetId = '';
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
