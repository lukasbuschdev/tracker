import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-add-dialog',
  imports: [],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})
export class AddDialogComponent implements OnInit {
  isOpen: boolean = false;
  isDropdownOpened: boolean = false;
  selectableCategories: string[] = ['Transportation', 'Food', 'Rent']
  selectedCategory: string = 'Select category'

  constructor(public dialog: DialogService) { }


  ngOnInit(): void {
    this.dialog.isVisible$.subscribe(state => {
      this.isOpen = state;
    })  
  }

  closeDialog(): void {
    this.dialog.closeDialog();
  }

  getData(name: string, amount: string): void {
    this.closeDialog();
    console.log(name, Number(amount))
  }

  toggleCategories(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeCategories(): void {
    this.isDropdownOpened = false;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
