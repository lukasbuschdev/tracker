import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  isLoading: boolean = false;

  async downloadPDF(element: HTMLElement, filename: string = 'download.pdf'): Promise<void> {
    this.isLoading = true;

    const options = {
      margin: 0.5,  // Adjust margin as needed (in inches)
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 6 }, // Increase scale for higher resolution
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(options).from(element).save();
    this.isLoading = false;
  }
}
