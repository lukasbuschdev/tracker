import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';
import { typeCategory, typeDialogData } from '../../types/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  isOpen: boolean = false;
  isDropdownOpened: boolean = false;
  isArchiveChecked: boolean = false;
  selectableCategories: string[] = [];
  nameRegex: RegExp = /^[A-Za-z0-9 ]+$/;
  availableInSelectedBudget: number = 0;
  isRecreateChecked: boolean = false;

  constructor(public dialog: DialogService, public data: DataService) { }

  @ViewChild('inputName') inputName!: ElementRef<HTMLInputElement>;
  @ViewChild('amount') amount!: ElementRef<HTMLInputElement>;

  router = inject(Router);
  theme = inject(ThemeService);

  ngOnInit(): void {
    this.dialog.isVisible$.subscribe(state => {
      this.isOpen = state;

      if(this.isOpen) {
        this.setIsCreated();
      }
    });
  }

  setIsCreated(): void {
    if(this.dialog.addOrEdit === 'Edit') {
      if(this.dialog.type === 'budget') {
        this.isRecreateChecked = this.data.clickedBudget?.recreate || false;
      } else if(this.dialog.type === 'category') {
        this.isRecreateChecked = this.data.clickedCategory?.recreate || false;
      }
    } else {
      this.isRecreateChecked = false;
    }
  }

  closeDialog(): void {
    this.dialog.closeDialog();
    this.data.selectedCategory = 'Select category';
    this.isRecreateChecked = false;
  }

  getData(name: string, amount: string): void {
    this.checkInputAmount(Number(amount));

    if(this.dialog.isInputInvalid || !this.nameRegex.test(name)) return;

    const dialogData: typeDialogData = {
      name: name,
      amount: Number(amount),
      recreate: this.isRecreateChecked
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

  toggleIsRecreateChecked(): void {
    this.isRecreateChecked = !this.isRecreateChecked;
  }

  toggleIsArchiveChecked(): void {
    this.isArchiveChecked = !this.isArchiveChecked;
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
    let categoryOfExpense;

    if(this.dialog.addOrEdit === 'Add') {
      categoryOfExpense = this.data.categoriesArray.find(category => category.name === this.data.selectedCategory);
    } else {
      categoryOfExpense = this.data.categoriesArray.find(category => category.name === this.data.clickedExpense?.category);
    }

    if(!categoryOfExpense) return;
    this.checkForExpenses(amount, categoryOfExpense);
  }

  checkForExpenses(amount: number, categoryOfExpense: typeCategory): void {
    const amountUsedInCategory = this.calculateAmountUsedInCategory(categoryOfExpense);

    if(amount > categoryOfExpense.amount) {
      this.dialog.setAmountTooBig();
      return;
    }

    if(amount > (categoryOfExpense.amount - amountUsedInCategory)) {
      this.dialog.setAmountTooBig();
      return;
    }
  }

  calculateAmountUsedInCategory(categoryOfExpense: typeCategory): number {
    const allExpensesOfCategory = this.data.expensesArray.filter(expense => expense.category === categoryOfExpense.name);
    const allExpensesAmounts = allExpensesOfCategory.map(expense => expense.amount).reduce((acc, curr) => acc + curr, 0);

    return this.dialog.addOrEdit === 'Add' ? allExpensesAmounts : allExpensesAmounts - this.data.clickedExpense!.amount;
  }

  calculateAvailableBudget(): number {
    if(!this.data.selectedBudget) return 0;
    const categoriesAmounts = this.data.categoriesArray.map(category => category.amount);

    return this.availableInSelectedBudget = this.data.selectedBudget.amount - categoriesAmounts.reduce((acc, curr) => acc + curr, 0);
  }

  calculateCategoryUsed(): number {
    const category = this.data.categoriesArray.find(category => category.name === this.data.selectedCategory);
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
}
