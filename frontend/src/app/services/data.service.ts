import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Category } from '../models/category';
import { DialogService } from './dialog.service';
import { typeDialogData } from '../types/types';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public currentUserId: string = '';
  public currentUser: User | null = null;
  public isLoggedIn: boolean = false;

  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private expensesSubject = new BehaviorSubject<Expense[]>([]);


  public get budgetsArray() {
    return this.budgetsSubject.value;
  }

  public get categoriesArray() {
    return this.categoriesSubject.value;
  }

  public get expensesArray() {
    return this.expensesSubject.value;
  }

  public selectedBudget: Budget | null = null;
  public selectedCategory: string = 'Select category';

  public clickedBudget: Budget | null = null; 
  public clickedCategory: Category | null = null;
  public clickedExpense: Expense | null = null;

  constructor(private dialog: DialogService) { }

  public async init(): Promise<void> {
    await this.getData();
  }


  private async getUser(): Promise<void> {
    if(!this.currentUser || !this.currentUserId) return;

    try {
      this.currentUser = await User.get(this.currentUserId); 
    } catch (error) {
      console.error(error);
    }
  }

  public async getLoggedUserFromLocalStorage(): Promise<void> {
    const storedUserString = localStorage.getItem('loggedUser');
    if(!storedUserString) return;
    
    const loggedUser = JSON.parse(storedUserString);

    this.currentUserId = loggedUser.id;
    this.isLoggedIn = loggedUser.isLoggedIn;
    this.currentUser = await User.get(this.currentUserId);
  }

  private async getData(): Promise<void> {
    if(!this.currentUserId) return;

    try {
      const budgets = await Budget.get(this.currentUserId);
      if(!budgets.length) return;

      this.budgetsSubject.next(budgets);
      this.selectedBudget = budgets[0];
      
      await this.getCategories();
      await this.getExpenses();
      this.calculateCurrentAvailable();
    } catch (error) {
      console.error(error);
    }
  }

  public async getCategories(): Promise<void> {
    if(!this.selectedBudget) return;
    const categories = await Category.get(this.selectedBudget.id);
    this.categoriesSubject.next(categories);
  }
  
  public async getExpenses(): Promise<void> {
    if(!this.selectedBudget) return;
    const expenses = await Expense.get(this.selectedBudget.id);
    this.expensesSubject.next(expenses);
  }

  public calculateCurrentAvailable(): number {
    if(!this.selectedBudget) return 0;
    const allExpenses = this.expensesSubject.value.map(expense => expense.amount);
    const expensesAmount = allExpenses.reduce((acc, curr) => acc + curr, 0);

    return this.selectedBudget.amount - expensesAmount;
  }

  public getAllCategoriesData(): { name: string[], amount: number[] } {
    const allCategoriesNames = this.categoriesArray.map(category => category.name);
    const allCategoriesAmounts = this.categoriesArray.map(category => category.amount);

    return {
      name: allCategoriesNames,
      amount: allCategoriesAmounts
    }
  }

  public selectBudget(budget: Budget): void {
    this.selectedBudget = this.budgetsArray.find(dataBudget => dataBudget.id === budget.id) || null;
    this.getCategories();
    this.getExpenses();
  }

  public logout(): void {
    this.currentUser = null;
    this.currentUserId = '';
    this.isLoggedIn = false;
    this.budgetsSubject.next([]);
    this.categoriesSubject.next([]);
    this.expensesSubject.next([]);
    this.selectedBudget = null;
  }







  // ADD DATA TO DATABASE

  public addData(dialogData: typeDialogData): Promise<void> {
    if(this.dialog.type === 'budget') return this.createBudget(dialogData);
    if(this.dialog.type === 'category') return this.createCategory(dialogData);
    return this.createExpense(dialogData);
  }

  private async createBudget(dialogData: typeDialogData): Promise<void> {
    const budget = {
      name: dialogData.name,
      userId: this.currentUserId,
      amount: dialogData.amount,
      used: 0,
      recreate: false
    }

    const newBudget = await Budget.create(budget);
    const currentBudgets = this.budgetsSubject.value;
    this.budgetsSubject.next([...currentBudgets, newBudget]);
    this.selectedBudget = newBudget;
  }

  private async createCategory(dialogData: typeDialogData): Promise<void> {
    if(!this.selectedBudget) return;

    const category = {
      name: dialogData.name,
      budgetId: this.selectedBudget.id,
      amount: dialogData.amount,
      used: 0,
      recreate: false
    }

    const newCategory = await Category.create(category);
    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next([...currentCategories, newCategory]);
  }

  private async createExpense(dialogData: typeDialogData): Promise<void> {
    if(!this.selectedBudget) return;

    const expense = {
      name: dialogData.name,
      budgetId: this.selectedBudget.id,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    const newExpense = await Expense.create(expense);
    const currentExpenses = this.expensesSubject.value;
    this.expensesSubject.next([...currentExpenses, newExpense]);

    this.updateUsed();
  }

  private async updateUsed(): Promise<void> {
    if(!this.selectedBudget) return;

    let updatedUsed = this.selectedBudget.amount - this.calculateCurrentAvailable();

    const budgetUsed = {
      used: updatedUsed
    }

    const editedBudget = await Budget.patch(this.selectedBudget.id, budgetUsed);
    const updatedBudgets = this.budgetsSubject.value.map(budget => {
      return budget.id === editedBudget.id ? { ...budget, ...editedBudget } : budget;
    });

    this.budgetsSubject.next(updatedBudgets);
  }









  // EDIT DATA FROM DATABASE

  public editData(dialogData: typeDialogData): Promise<void> {
    if(this.dialog.type === 'budget') return this.editBudget(dialogData);
    if(this.dialog.type === 'category') return this.editCategory(dialogData);
    return this.editExpense(dialogData);
  }

  private async editBudget(dialogData: typeDialogData): Promise<void> {
    if(!this.clickedBudget) return;
    
    const budgetData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    const editedBudget = await Budget.patch(this.clickedBudget.id, budgetData);
    const updatedBudgets = this.budgetsSubject.value.map(budget => {
      return budget.id === editedBudget.id ? { ...budget, ...editedBudget } : budget;
    });

    this.budgetsSubject.next(updatedBudgets);

    await this.getData();
    this.calculateCurrentAvailable();
  }

  private async editCategory(dialogData: typeDialogData): Promise<void> {
    if(!this.clickedCategory) return;
    
    const categoryData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    const clickedCategoryName = this.clickedCategory.name;
    const editedCategory = await Category.patch(this.clickedCategory.id, categoryData);
    const updatedCategories = this.categoriesSubject.value.map(category => {
      return category.id === editedCategory.id ? { ...category, ...editedCategory } : category;
    });

    this.categoriesSubject.next(updatedCategories);

    this.updateExpenses(dialogData, clickedCategoryName);
    this.calculateCurrentAvailable();
  }

  private async updateExpenses(dialogData: typeDialogData, clickedCategoryName: string): Promise<void> {
    const relatedExpenses = this.expensesSubject.value.filter(expense => expense.category === clickedCategoryName);

    const editedExpenses = await Promise.all(
      relatedExpenses.map(expense => {
        expense.category = dialogData.name;
        return Expense.patch(expense.id, expense);
      })
    );

    const updatedExpenses = this.expensesSubject.value.map(expense => {
      const editedExpense = editedExpenses.find(e => e.id === expense.id);
      return editedExpense ? { ...expense, ...editedExpense } : expense;
    });
    
    this.expensesSubject.next(updatedExpenses);
  }

  private async editExpense(dialogData: typeDialogData): Promise<void> {
    if(!this.clickedExpense) return;
    this.selectedCategory = this.dialog.category;
    
    const expenseData = {
      name: dialogData.name,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    const editedExpense = await Expense.patch(this.clickedExpense?.id, expenseData);
    const updatedExpenses = this.expensesSubject.value.map(expense => {
      return expense.id === editedExpense.id ? { ...expense, ...editedExpense } : expense;
    });

    this.expensesSubject.next(updatedExpenses);

    this.calculateCurrentAvailable();
  }

  public async editUser(name: string): Promise<void> {
    const userData = {
      name: name
    } 

    await User.patch(this.currentUserId, userData);
    await this.getUser();
  }








  

  // // DELETE

  public deleteData() {
    if(this.dialog.type === 'budget') return this.deleteBudget(this.clickedBudget?.id);
    if(this.dialog.type === 'category') return this.dialog.openConfirmationDialog('category');
    return this.deleteExpense(this.clickedExpense);
  }

  private async deleteBudget(budgetId?: string): Promise<void> {
    if(!budgetId) return;

    await Budget.delete(budgetId);

    const updatedBudgets = this.budgetsArray.filter(budget => budget.id !== budgetId);
    this.budgetsSubject.next(updatedBudgets);

    this.updateCategoriesAndExpenses(budgetId);
    this.dialog.closeDialog();
  }

  private updateCategoriesAndExpenses(budgetId: string): void {
    const updatedCategories = this.categoriesArray.filter(category => category.budgetId !== budgetId);
    const updatedExpenses = this.expensesArray.filter(expense => expense.budgetId !== budgetId);

    this.categoriesSubject.next(updatedCategories);
    this.expensesSubject.next(updatedExpenses);
  }

  public async deleteCategory(selectedCategory: Category | null): Promise<void> {
    if(!selectedCategory) return;

    await Category.delete(selectedCategory.id);

    const updatedCategories = this.categoriesArray.filter(category => category.id !== selectedCategory.id);
    this.categoriesSubject.next(updatedCategories);

    await this.deleteExpensesOfCategory(selectedCategory);
  }

  private async deleteExpensesOfCategory(category: Category): Promise<void> {
    const expensesOfCategory = this.expensesArray.filter(expense => expense.category === category.name);
    const promises = expensesOfCategory.map(expense => Expense.delete(expense.id));
    await Promise.all(promises);

    const updatedExpenses = this.expensesArray.filter(expense => expense.category !== category.name);
    this.expensesSubject.next(updatedExpenses);

    this.updateUsed();
  }

  private async deleteExpense(selectedExpense: Expense | null): Promise<void> {
    if(!selectedExpense) return;

    await Expense.delete(selectedExpense.id);

    const updatedExpenses = this.expensesArray.filter(expense => expense.id !== selectedExpense.id);
    this.expensesSubject.next(updatedExpenses);

    this.updateUsed();
    this.dialog.closeDialog();
  }

  public async deleteAccount(): Promise<void> {
    await User.delete(this.currentUserId);
    this.dialog.closeConfirmationDialog();
  }
}
