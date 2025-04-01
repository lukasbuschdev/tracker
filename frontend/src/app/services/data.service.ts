import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Expense } from '../models/expense';
import { Category } from '../models/category';
import { DialogService } from './dialog.service';
import { typeBudget, typeCategory, typeDialogData, typeExpense } from '../types/types';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { ThemeService } from './theme.service';

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
  private archivedBudgetsSubject = new BehaviorSubject<Budget[]>([]);
  private archivedCategoriesSubject = new BehaviorSubject<Category[]>([]);
  private archivedExpensesSubject = new BehaviorSubject<Expense[]>([]);

  public get budgetsArray() {
    return this.budgetsSubject.value;
  }

  public get categoriesArray() {
    return this.categoriesSubject.value;
  }

  public get expensesArray() {
    return this.expensesSubject.value;
  }

  public get archivedBudgetsArray() {
    return this.archivedBudgetsSubject.value;
  }

  public get archivedCategoriesArray() {
    return this.archivedBudgetsSubject.value;
  }

  public get archivedExpensesArray() {
    return this.archivedBudgetsSubject.value;
  }

  filteredExpenses: Expense[] = [];

  public selectedBudget: Budget | null = null;
  public selectedCategory: string = 'Select category';

  public clickedBudget: Budget | null = null; 
  public clickedCategory: Category | null = null;
  public clickedExpense: Expense | null = null;

  constructor(private dialog: DialogService, private theme: ThemeService) { }

  public async init(): Promise<void> {
    await this.getData();

    this.runMonthlyRecreationCheck();
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
    this.theme.loadTheme();
    if(!this.currentUserId) return;
    
    try {
      await this.getBudgets();
      await this.getCategories();
      await this.getExpenses();
      await this.getArchivedBudgets();
      this.calculateCurrentAvailable();
    } catch (error) {
      console.error(error);
    }
  }

  private async getBudgets(): Promise<void> {
    const budgets = (await Budget.get(this.currentUserId)).filter(budget => budget.isArchived === false);
    if(!budgets.length) return;
    
    this.budgetsSubject.next(budgets);
    this.selectedBudget = this.budgetsArray[0];
  }

  public async getCategories(): Promise<void> {
    if(!this.selectedBudget) return;
    const categories = (await Category.get(this.selectedBudget.id)).filter(category => category.isArchived === false);
    this.categoriesSubject.next(categories);
  }
  
  public async getExpenses(): Promise<void> {
    if(!this.selectedBudget) return;
    const expenses = (await Expense.get(this.selectedBudget.id)).filter(budget => budget.isArchived === false);
    const sortedExpenses = this.sortExpensesByDate(expenses);
    this.expensesSubject.next(sortedExpenses);
  }

  private async getArchivedBudgets(): Promise<void> {
    const budgets = (await Budget.get(this.currentUserId)).filter(budget => budget.isArchived === true);
    if(!budgets.length) return;
    
    const budgetIds = budgets.map(budget => budget.id);
    // const categories = await this.getArchivedCategories(budgetIds);
    this.archivedBudgetsSubject.next(budgets);
    // this.archivedCategoriesSubject.next(categories);

    // console.log(budgets)
    // console.log(categories)
  }

  // private async getArchivedCategories(budgetIds: string[]): Promise<Category[]> {
  //   const categories = await Promise.all(
  //     budgetIds.map(async (budgetId) => {
  //       return (await Category.get(budgetId)).filter(category => category.isArchived === true);
  //     })
  //   );

  //   return categories.flat();
  // }

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

  private sortExpensesByDate(expenses: typeExpense[]): Expense[] | [] {
    if(!expenses) return [];
    return expenses.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  }

  public selectBudget(budget: Budget): void {
    this.selectedBudget = this.budgetsArray.find(dataBudget => dataBudget.id === budget.id) || null;
    if(!this.selectedBudget) return;

    this.getCategories();
    this.getExpenses();
  }

  private runMonthlyRecreationCheck(): void {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;
    const executedMonth = localStorage.getItem("monthlyRecreationCheckExecuted");
  
    // if(executedMonth !== currentMonth) {
    //   this.checkRecreation();
    //   localStorage.setItem("monthlyRecreationCheckExecuted", currentMonth);
    // } else {
    //   console.log("Monthly recreation check already executed for", currentMonth);
    // }
    this.checkRecreation();
  }

  private async checkRecreation(): Promise<void> {
    const recreationBudgets = this.budgetsArray.filter(budget => budget.recreate === true);
    const recreationData: [Budget, Category[]][] = await Promise.all(
      recreationBudgets.map(async (recreationBudget) => {
        const categories = (await Category.get(recreationBudget.id)).filter(category => category.recreate === true);
        return [recreationBudget, categories];
      })
    );

    this.recreateData(recreationData);
  }

  private async recreateData(data: [Budget, Category[]][]): Promise<void> {
    const createdData = await Promise.all(
      data.map(async ([budget, categories]) => {
        // const newBudget = await this.getNewBudgets(budget);
        // const newCategories = await this.getNewCategories(newBudget.id, categories);
        await this.moveBudgetsToArchive(budget);
        await this.moveCategoriesToArchive(categories);
      })
    );

    await this.getBudgets();
    await this.getCategories();
  }

  private getNewBudgets(budget: Budget): Promise<Budget> {
    try {
      return Budget.create({
        name: `${budget.name} NEW`,
        userId: this.currentUserId,
        amount: budget.amount,
        used: 0,
        recreate: budget.recreate,
        isArchived: false
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private getNewCategories(newBudgetId: string, categories: Category[]): Promise<Category[]> {
    try {
      return Promise.all(
        categories.map(async (category) => {
          return Category.create({
            name: `${category.name} NEW`,
            budgetId: newBudgetId,
            amount: category.amount,
            used: 0,
            recreate: category.recreate,
            isArchived: false
          });
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private moveBudgetsToArchive(budget: Budget): Promise<Budget> {
    try {
      return Budget.patch(budget.id, {
        isArchived: true
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private moveCategoriesToArchive(categories: Category[]): Promise<Category[]> {
    try {
      return Promise.all(
        categories.map(async (category) => {
          return Category.patch(category.id, {
            isArchived: false
          });
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public logout(): void {
    this.resetLoggedUserInLocalStorage();

    this.currentUser = null;
    this.currentUserId = '';
    this.isLoggedIn = false;
    this.budgetsSubject.next([]);
    this.categoriesSubject.next([]);
    this.expensesSubject.next([]);
    this.selectedBudget = null;
  }

  private resetLoggedUserInLocalStorage(): void {
    localStorage.setItem('loggedUser', '')
  }

  public resetFilter(): void {
    this.filteredExpenses = this.expensesArray;
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
      recreate: dialogData.recreate,
      isArchived: false
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
      recreate: dialogData.recreate,
      isArchived: false
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
      recreate: false,
      isArchived: false
    }

    const newExpense = await Expense.create(expense);
    const currentExpenses = this.expensesSubject.value;
    const currentExpensesSorted = this.sortExpensesByDate([...currentExpenses, newExpense]);
    this.expensesSubject.next(currentExpensesSorted);

    this.updateUsed();
    this.resetFilter();
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
      recreate: dialogData.recreate
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
      recreate: dialogData.recreate
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
    const updatedExpensesSorted = this.sortExpensesByDate(updatedExpenses);
    
    this.expensesSubject.next(updatedExpensesSorted);
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
    const updatedExpensesSorted = this.sortExpensesByDate(updatedExpenses);

    this.expensesSubject.next(updatedExpensesSorted);

    this.calculateCurrentAvailable();
    this.resetFilter();
  }

  public async editUser(name?: string, isVerified?: boolean): Promise<void> {
    const userData = {
      name: name,
      isVerified: isVerified
    } 

    await User.patch(this.currentUserId, userData);
    await this.getUser();
  }








  

  // DELETE

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
    
    if(this.selectedBudget?.id === budgetId) {
      this.selectedBudget = this.budgetsArray[0];
    }
  }

  private updateCategoriesAndExpenses(budgetId: string): void {
    const updatedCategories = this.categoriesArray.filter(category => category.budgetId !== budgetId);
    const updatedExpenses = this.expensesArray.filter(expense => expense.budgetId !== budgetId);
    const updatedExpensesSorted = this.sortExpensesByDate(updatedExpenses);

    this.categoriesSubject.next(updatedCategories);
    this.expensesSubject.next(updatedExpensesSorted);
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
    const updatedExpensesSorted = this.sortExpensesByDate(updatedExpenses);
    this.expensesSubject.next(updatedExpensesSorted);

    this.updateUsed();
  }

  private async deleteExpense(selectedExpense: Expense | null): Promise<void> {
    if(!selectedExpense) return;

    await Expense.delete(selectedExpense.id);

    const updatedExpenses = this.expensesArray.filter(expense => expense.id !== selectedExpense.id);
    const updatedExpensesSorted = this.sortExpensesByDate(updatedExpenses);
    this.expensesSubject.next(updatedExpensesSorted);

    this.updateUsed();
    this.resetFilter();
    this.dialog.closeDialog();
  }

  public async deleteAccount(): Promise<void> {
    await User.delete(this.currentUserId);
    this.dialog.closeConfirmationDialog();
  }
}
