import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { Budget } from '../../../models/budget';

@Component({
  selector: 'app-budgets',
  imports: [],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent implements OnInit {
  isActiveBudget: boolean = false;
  activeBudgetId: string = '';

  budget = {
    name: 'Transportation',
    userId: 'c9122b3f-9c14-4693-ab50-359278e857cf',
    amount: 250,
    used: 250,
    recreate: false,
  }

  constructor(public utils: UtilsService, private dialog: DialogService, public data: DataService) { }

  ngOnInit(): void {
    console.log(this.data.budgets)
  }

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
    // this.createBudget();
  }
  
  // async createBudget(): Promise<void> {
  //   const newBudget = await Budget.create(this.budget); 
  //   this.data.budgets.push(newBudget);
  // }
}
