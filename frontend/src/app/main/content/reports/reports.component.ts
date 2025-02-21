import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  isDropdownOpened: boolean = false;
  selectableBudgets: string[] = ['Income', 'Savings', 'Whatever'];
  selectedBudget: string = 'Income';

  constructor(public utils: UtilsService) { }

  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeBudgets(): void {
    this.isDropdownOpened = false;
  }

  selectBudget(budget: string): void {
    this.selectedBudget = budget;
  }
}
