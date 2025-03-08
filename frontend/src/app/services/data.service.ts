import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUserId: string = 'c9122b3f-9c14-4693-ab50-359278e857cf'; //ID Lukas
  // currentUserId: string = '564eddf1-873b-44a6-91c0-1cc81defb1a2'; //ID Olaf
  
  budgets: Budget[] = [];
  expenses: Expense[] = [];
  categories: Category[] = [];
  selectedBudget: Budget | null = null;
  currentAvailable: number = 0;
  clickedBudget: Budget | null = null; 
  clickedCategory: Category | null = null;
  clickedExpense: Expense | null = null;

  constructor() {
    this.getData();
  }

  async getData(): Promise<void> {
    try {
      this.budgets = await Budget.get(this.currentUserId);
      if(!this.budgets.length) return;

      this.selectedBudget = this.budgets[0];
      this.currentAvailable = this.selectedBudget.amount - this.selectedBudget.used;
      await this.getExpenses();
      await this.getCategories();
    } catch (error) {
      console.error(error)
    }
  }

  async getExpenses(): Promise<void> {
    if(!this.selectedBudget) return;
    this.expenses = await Expense.get(this.selectedBudget.id);
    // console.log(this.expenses)
  }

  async getCategories(): Promise<void> {
    if(!this.selectedBudget) return;
    this.categories = await Category.get(this.selectedBudget.id);
    // console.log(this.categories)
  }
}
