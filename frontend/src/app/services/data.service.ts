import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Category } from '../models/category';
import { DialogService } from './dialog.service';
import { typeDialogData } from '../types/types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUserId: string = 'c9122b3f-9c14-4693-ab50-359278e857cf'; //ID Lukas
  // currentUserId: string = '564eddf1-873b-44a6-91c0-1cc81defb1a2'; //ID Olaf

  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$: Observable<Budget[]> = this.budgetsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();


  public get budgetsArray() {
    return this.budgetsSubject.value;
  }

  public get categoriesArray() {
    return this.categoriesSubject.value;
  }

  public get expensesArray() {
    return this.expensesSubject.value;
  }

  selectedBudget: Budget | null = null;
  selectedCategory: string = 'Select category';
  // currentAvailable: number = 0;
  clickedBudget: Budget | null = null; 
  clickedCategory: Category | null = null;
  clickedExpense: Expense | null = null;

  constructor(private dialog: DialogService) {
    this.getData();
  }


  private async getData(): Promise<void> {
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
    // console.log(this.categoriesSubject.value)
  }
  
  public async getExpenses(): Promise<void> {
    if(!this.selectedBudget) return;
    const expenses = await Expense.get(this.selectedBudget.id);
    this.expensesSubject.next(expenses);
    // console.log(this.expensesSubject.value)
  }


  public calculateCurrentAvailable(budget?: Budget): number {
    if(!this.selectedBudget) return 0;
    const allExpenses = this.expensesSubject.value.map(expense => expense.amount);
    const expensesAmount = allExpenses.reduce((acc, curr) => acc + curr, 0);

    return this.selectedBudget.amount - expensesAmount;
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
  }

  private async createCategory(dialogData: typeDialogData): Promise<void> {
    if(!this.selectedBudget) return;

    const category = {
      name: dialogData.name,
      budgetId: this.selectedBudget?.id,
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
      budgetId: this.selectedBudget?.id,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    const newExpense = await Expense.create(expense);
    const currentExpenses = this.expensesSubject.value;
    this.expensesSubject.next([...currentExpenses, newExpense]);

    this.updateUsed(dialogData.amount);
  }

  private async updateUsed(amount: number): Promise<void> {
    if(!this.selectedBudget) return;
    const updatedUsed = this.selectedBudget.used + amount;

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
    const budgetData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    if(!this.clickedBudget) return;

    const editedBudget = await Budget.patch(this.clickedBudget.id, budgetData);
    const updatedBudgets = this.budgetsSubject.value.map(budget => {
      return budget.id === editedBudget.id ? { ...budget, ...editedBudget } : budget;
    });

    this.budgetsSubject.next(updatedBudgets);

    await this.getData();
    this.calculateCurrentAvailable();
  }

  private async editCategory(dialogData: typeDialogData): Promise<void> {
    const categoryData = {
      name: dialogData.name,
      amount: dialogData.amount,
      recreate: false
    }

    if(!this.clickedCategory) return;
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
    const expenseData = {
      name: dialogData.name,
      amount: dialogData.amount,
      category: this.selectedCategory,
      recreate: false
    }

    if(!this.clickedExpense) return;

    const editedExpense = await Expense.patch(this.clickedExpense?.id, expenseData);
    const updatedExpenses = this.expensesSubject.value.map(expense => {
      return expense.id === editedExpense.id ? { ...expense, ...editedExpense } : expense;
    });

    this.expensesSubject.next(updatedExpenses);

    this.calculateCurrentAvailable();
  }








  

  // // DELETE

  deleteData() {

  }
}
