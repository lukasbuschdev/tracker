import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isCategory: boolean = false;
  addOrEdit: string = '';
  type: string = '';
  confirmationType: string = '';
  category: string = 'Select category';
  
  private _isVisible = new BehaviorSubject<boolean>(false);
  isVisible$ = this._isVisible.asObservable();

  private _isConfirmationVisible = new BehaviorSubject<boolean>(false);
  isConfirmationVisible$ = this._isConfirmationVisible.asObservable();

  openDialog(str: string, cat?: string): void {
    this._isVisible.next(true);
    this.checkAddOrEdit(str, cat);
    this.checkType(str);
  }

  openConfirmationDialog(str: string): void {
    this.closeDialog();
    this.confirmationType = str;
    this._isConfirmationVisible.next(true);
  }

  closeDialog(): void {
    this._isVisible.next(false);
  }

  closeConfirmationDialog(): void {
    this._isConfirmationVisible.next(false);
  }

  checkAddOrEdit(str: string, cat?: string): void {
    this.addOrEdit = str.includes('add') ? 'Add' : 'Edit';
    if(this.addOrEdit === 'Add' || cat === undefined) return;
    this.category = cat;
  }

  checkType(str: string): string {
    if(str.includes('expense')) return this.type = 'expense';
    if(str.includes('budget')) return this.type = 'budget';
    return this.type = 'category';
  }
}
