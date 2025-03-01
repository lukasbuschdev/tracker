import { Component } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { Budget } from '../../../models/budget';

@Component({
  selector: 'app-expenses',
  imports: [],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  isFilterVisible: boolean = false;
  isDropdownOpened: boolean = false;

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

  selectBudget(budget: Budget): void {
    this.data.selectedBudget = budget;
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
