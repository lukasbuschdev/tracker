import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';
import { typeDialogData } from '../../types/types';
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

  constructor(public dialog: DialogService, public data: DataService) { }

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
    const dialogData: typeDialogData = {
      name: name,
      amount: Number(amount)
    }
    
    this.dialog.addOrEdit === 'Add' ? this.data.addData(dialogData) : this.data.editData(dialogData);
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
}
