import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
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
    this.selectedCategory = 'Select category';
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

  formatLabel(str: string): string {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
  }
}
