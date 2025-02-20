import { Component } from '@angular/core';
import { BudgetOrCategory } from '../../../types/types';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';
  categories: BudgetOrCategory[] = [
    {
      id: '0',
      name: "Transportation",
      generalAvailable: 270.00,
      used: 71.40,
      currentAvailable: 198.60
    },
    {
      id: '1',
      name: "Food",
      generalAvailable: 320.00,
      used: 172.50,
      currentAvailable: 147.50
    },
    {
      id: '2',
      name: "Rent",
      generalAvailable: 720.00,
      used: 720.00,
      currentAvailable: 0.00
    }
  ]

  toggleActiveCategory(event: MouseEvent, categoryId: string): void {
    event.stopPropagation();
    if(this.activeCategoryId === categoryId) return this.closeCategory();
    this.activeCategoryId = categoryId;
  }

  closeCategory(): void {
    this.activeCategoryId = '';
  }

  editCategory(event: MouseEvent): void {
    event.stopPropagation();
  }
}
