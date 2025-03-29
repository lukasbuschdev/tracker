import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { DataService } from '../../services/data.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements OnInit {
  isOpen: boolean = false;

  router = inject(Router);
  theme = inject(ThemeService);

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
    
    this.router.navigateByUrl('/login');
    return this.data.deleteAccount();
  }
}
