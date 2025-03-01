import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DataService } from '../../../services/data.service';
import { Budget } from '../../../models/budget';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  isDropdownOpened: boolean = false;

  constructor(public utils: UtilsService, public data: DataService) { }

  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeBudgets(): void {
    this.isDropdownOpened = false;
  }

  selectBudget(budget: Budget): void {
    this.data.selectedBudget = budget;
  }
}
