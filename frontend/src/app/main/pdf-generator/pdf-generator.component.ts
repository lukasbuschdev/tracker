import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { DownloadService } from '../../services/download.service';
import { UtilsService } from '../../services/utils.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-pdf-generator',
  imports: [CommonModule, TranslatePipe, CommonModule],
  templateUrl: './pdf-generator.component.html',
  styleUrl: './pdf-generator.component.scss'
})
export class PdfGeneratorComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  data = inject(DataService);
  language = inject(LanguageService);
  download = inject(DownloadService);
  utils = inject(UtilsService);

  downloadPDF(): void {
    if(this.pdfContent && this.pdfContent.nativeElement) {
      this.download.downloadPDF(this.pdfContent.nativeElement, `${this.data.clickedBudget?.name}.pdf`);
    } else {
      console.error('PDF content not found.');
    }
  }

  calculateCategoryUsed(category: Category): number {
    const expenses = this.data.archivedExpensesOfClickedBudget.filter(expense => expense.category === category.name);
    const expensesAmount = expenses.map(expense => expense?.amount);
    const categoryAmountUsed = expensesAmount.reduce((acc, curr) => acc + curr, 0);

    return categoryAmountUsed;
  }

  calculateCurrentBudgetSum(): number {
    const expensesAmount = this.data.archivedExpensesOfClickedBudget.map(expense => expense.amount).reduce((acc, curr) => acc + curr, 0); 
    return expensesAmount;
  }
}
