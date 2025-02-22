import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isCategory: boolean = false;
  addOrEdit: string = '';
  type: string = '';

  private _isVisible = new BehaviorSubject<boolean>(false);
  isVisible$ = this._isVisible.asObservable();

  openDialog(str: string): void {
    this._isVisible.next(true);
    this.checkAddOrEdit(str);
    this.checkType(str);
  }

  closeDialog(): void {
    this._isVisible.next(false);
  }

  checkAddOrEdit(str: string): void {
    str.includes('add') ? this.addOrEdit = 'Add' : this.addOrEdit = 'Edit';
  }

  checkType(str: string): string {
    if(str.includes('expense')) return this.type = 'expense';
    if(str.includes('budget')) return this.type = 'budget';
    return this.type = 'category';
  }
}
