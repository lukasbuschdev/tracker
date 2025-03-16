import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isCategory: boolean = false;
  addOrEdit: string = '';
  type: string = '';
  category: string = 'Select category';
  
  private _isVisible = new BehaviorSubject<boolean>(false);
  isVisible$ = this._isVisible.asObservable();

  openDialog(str: string, cat?: string): void {
    this._isVisible.next(true);
    this.checkAddOrEdit(str, cat);
    this.checkType(str);
  }

  closeDialog(): void {
    this._isVisible.next(false);
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
