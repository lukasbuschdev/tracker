import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from '../../../services/dialog.service';
import { DataService } from '../../../services/data.service';
import { Budget } from '../../../models/budget';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  isDropdownOpened: boolean = false;
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';

  constructor(public utils: UtilsService, private dialog: DialogService, public data: DataService) { }

  toggleActiveCategory(event: MouseEvent, categoryId: string): void {
    event.stopPropagation();
    if(this.activeCategoryId === categoryId) return this.closeCategory();
    this.activeCategoryId = categoryId;
    this.data.clickedCategory = this.data.categories.filter(category => category.id === this.activeCategoryId)[0];
  }

  closeCategory(): void {
    this.activeCategoryId = '';
  }

  editCategory(event: MouseEvent): void {
    event.stopPropagation();
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
    this.data.getCategories();
    this.data.getExpenses();
  }

  openDialog(str: string): void {
    this.dialog.openDialog(str);
  }
}
