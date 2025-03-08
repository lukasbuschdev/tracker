import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';
import { Budget } from '../../models/budget';
import { typeDialogData, typeExpense } from '../../types/types';
import { Category } from '../../models/category';
import { Expense } from '../../models/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  isOpen: boolean = false;
  isDropdownOpened: boolean = false;
  selectableCategories: string[] = [];
  selectedCategory: string = 'Select category';

  constructor(public dialog: DialogService, public data: DataService) { }

  ngOnInit(): void {
    this.dialog.isVisible$.subscribe(state => {
      this.isOpen = state;
    });
  }

  closeDialog(): void {
    this.dialog.closeDialog();
    this.selectedCategory = 'Select category';
  }

  getData(name: string, amount: string): void {
    const dialogData: typeDialogData = {
      name: name,
      amount: Number(amount)
    }
    
    this.dialog.addOrEdit === 'Add' ? this.addData(dialogData) : this.editData(dialogData);
    this.closeDialog();
  }

  toggleCategories(event: MouseEvent): void {
    event.stopPropagation();
    this.selectableCategories = this.data.categories.map(category => category.name);
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeCategories(): void {
    this.isDropdownOpened = false;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.dialog.category = this.selectedCategory;
  }

  formatLabel(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // ADD DATA TO DATABASE

  addData(dialogData: typeDialogData): Promise<void> {
    if(this.dialog.type === 'budget') return this.createBudget(dialogData);
    if(this.dialog.type === 'category') return this.createCategory(dialogData);
    return this.createExpense(dialogData);
  }

  async createBudget(dialogData: typeDialogData): Promise<void> {
    const budget = {
      name: dialogData.name,
      userId: this.data.currentUserId,
      amount: dialogData.amount,
      used: 0,
      recreate: false
    }

    const newBudget = await Budget.create(budget);
    this.data.budgets.push(newBudget);
  }

  async createCategory(dialogData: typeDialogData): Promise<void> {
    if(!this.data.selectedBudget) return;

    const category = {
      name: dialogData.name,
      budgetId: this.data.selectedBudget?.id,
      amount: dialogData.amount,
      used: 0,
      recreate: false
    }

    const newCategory = await Category.create(category);
    this.data.categories.push(newCategory);
  }

  async createExpense(dialogData: typeDialogData): Promise<void> {
    if(!this.data.selectedBudget) return;

    const expense = {
      name: dialogData.name,
      budgetId: this.data.selectedBudget?.id,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    const newExpense = await Expense.create(expense);
    this.data.expenses.push(newExpense);
  }


  // EDIT DATA FROM DATABASE

  editData(dialogData: typeDialogData): Promise<void> {
    if(this.dialog.type === 'budget') return this.editBudget(dialogData);
    if(this.dialog.type === 'category') return this.editCategory(dialogData);
    return this.editExpense(dialogData);
  }

  async editBudget(dialogData: typeDialogData): Promise<void> {
    const budgetData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    if(!this.data.clickedBudget) return;

    const editedBudget = await Budget.patch(this.data.clickedBudget.id, budgetData);
    this.data.budgets = this.data.budgets.map(budget => {
      return budget.id === editedBudget.id ? { ...budget, ...editedBudget } : budget;
    });
  }

  async editCategory(dialogData: typeDialogData): Promise<void> {
    const categoryData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    if(!this.data.clickedCategory) return;
    const clickedCategoryName = this.data.clickedCategory.name;

    const editedCategory = await Category.patch(this.data.clickedCategory.id, categoryData);
    this.data.categories = this.data.categories.map(category => {
      return category.id === editedCategory.id ? { ...category, ...editedCategory } : category;
    });

    this.updateExpenses(dialogData, clickedCategoryName);
  }

  async updateExpenses(dialogData: typeDialogData, clickedCategoryName: string): Promise<void> {
    const relatedExpenses = this.data.expenses.filter(expense => {
      return expense.category === clickedCategoryName ? expense : '';
    });

    const editedExpenses = await Promise.all(
      relatedExpenses.map(expense => {
        expense.category = dialogData.name;
        return Expense.patch(expense.id, expense);
      })
    );

    editedExpenses.forEach(editedExpense => {
      this.data.expenses = this.data.expenses.map(expense => {
        return expense.id === editedExpense.id ? { ...expense, ...editedExpense } : expense;
      });
    })
  }

  async editExpense(dialogData: typeDialogData): Promise<void> {
    const expenseData = {
      name: dialogData.name,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    if(!this.data.clickedExpense) return;

    const editedExpense = await Expense.patch(this.data.clickedExpense?.id, expenseData);
    this.data.expenses = this.data.expenses.map(expense => {
      return expense.id === editedExpense.id ? { ...expense, ...editedExpense } : expense;
    });
  }
}
