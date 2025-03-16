import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit {
  isOpen: boolean = false;

  constructor(public dialog: DialogService, private data: DataService) { }

  ngOnInit(): void {
    this.dialog.isConfirmationVisible$.subscribe(state => {
      this.isOpen = state;
    });
  }
  
  closeDialog() {
    this.dialog.closeConfirmationDialog();
    this.isOpen = false;
  }
  
  deleteData(): Promise<void> {
    this.closeDialog();
    if(this.dialog.confirmationType === 'category') return this.data.deleteCategory(this.data.clickedCategory);
    return this.data.deleteAccount();
  }
}
