import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';
import { typeDialogData } from '../../types/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  isOpen: boolean = false;
  isDropdownOpened: boolean = false;
  selectableCategories: string[] = [];
  nameRegex: RegExp = /^[A-Za-z0-9 ]+$/;
  availableInSelectedBudget: number = 0;

  constructor(public dialog: DialogService, public data: DataService) { }

  @ViewChild('inputName') inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('amount') amount!: ElementRef<HTMLInputElement>;

  router = inject(Router)

  ngOnInit(): void {
    this.dialog.isVisible$.subscribe(state => {
      this.isOpen = state;
    });
  }

  closeDialog(): void {
    this.dialog.closeDialog();
    this.data.selectedCategory = 'Select category';
  }

  getData(name: string, amount: string): void {
    this.checkInputAmount(Number(amount));

    if(this.dialog.isInputInvalid || !this.nameRegex.test(name)) return;

    const dialogData: typeDialogData = {
      name: name,
      amount: Number(amount)
    }
    
    this.dialog.addOrEdit === 'Add' ? this.data.addData(dialogData) : this.data.editData(dialogData);
    this.closeDialog();
  }

  getSettingsData(name: string): void {
    this.data.editUser(name);
    this.closeDialog();
  }

  toggleCategories(event: MouseEvent): void {
    event.stopPropagation();
    this.selectableCategories = this.data.categoriesArray.map(category => category.name);
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeCategories(): void {
    this.isDropdownOpened = false;
  }

  selectCategory(category: string): void {
    this.data.selectedCategory = category;
    this.dialog.category = this.data.selectedCategory;
  }

  formatLabel(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  deleteCategory() {
    this.data.deleteData();
  }

  logoutAndResetPassword(): void {
    this.data.logout();
    this.router.navigateByUrl('/reset-password-mail');
  }


  // INPUT CHECKS

  checkInputAmount(amount: number): void {
    this.dialog.resetFlags();
    this.dialog.addOrEditRequestMade = true;
    
    if(amount < 1 || '') {
      this.dialog.isAmountZero = true;
      this.dialog.isInputInvalid = true;
    }

    if(this.dialog.type === 'category') {
      this.checkForTypeCategory(amount);
    }
    
    if(this.dialog.type === 'expense') {
      this.checkForTypeExpense(amount);
    } 
  }
  
  checkForTypeCategory(amount: number): void {
    if(!this.data.selectedBudget) return;
    this.checkForCategoryAdd(amount);
  }

  checkForCategoryAdd(amount: number): void {
    const availableForCategories = this.calculateAvailableBudget();
    const amountUsedInCategory = this.calculateCategoryUsed();
    const allCategoriesAmount = this.calculateAllCategoriesAmount(amount);

    if(this.dialog.addOrEdit === 'Add') {
      if(amount > availableForCategories) {
        this.dialog.setAmountTooBig();
        return;
      }
    }

    if((this.data.selectedBudget!.amount - allCategoriesAmount) < 0) {
      this.dialog.setAmountTooBig();
      return;
    }
    
    if(amount < amountUsedInCategory) {
      this.dialog.setAmountTooLittle();
      return;
    }
  }
  
  checkForTypeExpense(amount: number): void {
    const categoryOfExpense = this.data.categoriesArray.find(category => category.name === this.data.clickedExpense?.category);
    if(!categoryOfExpense) return;
    this.checkForExpense(amount, categoryOfExpense);
  }

  checkForExpense(amount: number, categoryOfExpense: Category): void {
    const expensesAmountClickedExpense = this.calculateAllExpensesAmountOfClickedExpenseCategory(amount);
    const expensesAmount = this.calculateAllExpensesAmount(amount);
    const selectedCategory = this.data.categoriesArray.find(category => category.name === this.dialog.category);

    if(amount > (categoryOfExpense.amount - this.calculateCategoryUsed())) {
      this.dialog.setAmountTooBig();
    }
    
    if(this.dialog.addOrEdit === 'Add') {
      if(expensesAmount > 0) {
        this.dialog.setAmountTooBig();
        return;
      }

      if(!selectedCategory) return;
      if(amount > selectedCategory?.amount) {
        this.dialog.setAmountTooBig();
        return;
      }
    } else {
      if((expensesAmountClickedExpense - categoryOfExpense.amount) > 0) {
        this.dialog.setAmountTooBig();
        return;
      }
    }
  }

  calculateAvailableBudget(): number {
    if(!this.data.selectedBudget) return 0;
    const categoriesAmounts = this.data.categoriesArray.map(category => category.amount);

    return this.availableInSelectedBudget = this.data.selectedBudget.amount - categoriesAmounts.reduce((acc, curr) => acc + curr, 0);
  }

  calculateCategoryUsed(): number {
    const category = this.data.clickedCategory;
    if(!category) return 0;

    const expenses = this.data.expensesArray.filter(expense => expense.category === category.name);
    const expensesAmount = expenses.map(expense => expense.amount);
    const categoryAmountUsed = expensesAmount.reduce((acc, curr) => acc + curr, 0);

    return categoryAmountUsed;
  }

  calculateAllCategoriesAmount(amount: number): number {
    const allCategoriesAmounts = this.data.categoriesArray.map(category => category.amount);
    const result = allCategoriesAmounts.reduce((acc, curr) => acc + curr, 0);

    if(!this.data.clickedCategory) return 0;

    return (result - this.data.clickedCategory?.amount) + amount;
  }

  calculateAllExpensesAmountOfClickedExpenseCategory(amount: number): number {
    const allExpensesOfCategory = this.data.expensesArray.filter(expense => expense.category === this.data.clickedExpense?.category);
    const allAmounts = allExpensesOfCategory.map(expense => expense.amount);
    const result = allAmounts.reduce((acc, curr) => acc + curr, 0);

    if(!this.data.clickedExpense) return 0;

    return (result - this.data.clickedExpense.amount) + amount;
  }

  calculateAllExpensesAmount(amount: number): number {
    const selectedCategory = this.data.categoriesArray.find(category => category.name === this.dialog.category);
    const allExpensesFromSelectedCategory = this.data.expensesArray.filter(expense => expense.category === this.dialog.category);
    const allAmounts = allExpensesFromSelectedCategory.map(expense => expense.amount);
    const result = allAmounts.reduce((acc, curr) => acc + curr, 0);

    if(!selectedCategory) return 0;

    return (result - selectedCategory.amount) + amount;
  }
}
